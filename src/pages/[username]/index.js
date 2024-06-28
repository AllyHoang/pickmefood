import { TabBar } from "@/page-components/components/UserPage/TabBar";
import UserPage from "@/page-components/components/UserPage/UserPage";
import { UserPageLayout } from "@/page-components/layouts";
import jwt from "jsonwebtoken";

const UserPageIndex = ({ userId, loggedInUserId }) => {
  return <UserPage userId={userId} loggedInUserId={loggedInUserId}></UserPage>;
};

UserPageIndex.Layout = UserPageLayout;
export async function getServerSideProps(context) {
  // Fetch the token from context
  const { userId } = context.query;

  const token = context.req.cookies.token;

  // If there's no token, return immediately with userId set to null
  if (!token) {
    return {
      props: {
        userId: null,
      },
    };
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    // Handle token verification error
    return {
      props: {
        userId: null,
      },
    };
  }

  // Extract userId from decoded token
  const loggedInUserId = decodedToken.id;

  if (userId) {
    return {
      props: {
        userId,
        loggedInUserId,
      },
    };
  }
  // If no userId is provided, you might want to handle this case
  return {
    notFound: true,
  };
}

export default UserPageIndex;
