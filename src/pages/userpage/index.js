
import { TabBar } from "@/page-components/components/UserPage/TabBar";
import UserPage from "@/page-components/components/UserPage/UserPage";
import { UserPageLayout } from "@/page-components/layouts";
import jwt from "jsonwebtoken";

const UserPageIndex = ({ userId }) => {
  return <UserPage userId={userId}></UserPage>;
};

UserPageIndex.Layout = UserPageLayout;
export async function getServerSideProps(context) {
  // Fetch the token from context
  const token = context.req.cookies.token;

  // If there's no token, return immediately with userId set to null
  if (!token) {
    return {
      props: {
        userId: null,
      },
    };
  }

  // If there's a token, decode it to get user information
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

  // Extract userId from decoded token
  const userId = decodedToken.id;

  // Pass userId as props to the component
  return {
    props: {
      userId,
    },
  };
}

export default UserPageIndex;
