import { UserModel } from "@/core/models/User"; // Ensure this is the correct path and model name
import jwt from "jsonwebtoken";
import { UserPageLayout } from "@/page-components/layouts";
import UserPage from "@/page-components/components/UserPage/UserPage";

const UserPageIndex = ({ userId, loggedInUserId }) => {
  return <UserPage userId={userId} loggedInUserId={loggedInUserId}></UserPage>;
};

UserPageIndex.Layout = UserPageLayout;

const getIdFromUsername = async (username) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/findUser/${username}`
    );
    if (!response.ok) {
      throw new Error("User not found");
    }
    const user = await response.json();
    console.log("outside2", user._id);
    return user._id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export async function getServerSideProps(context) {
  // Fetch the token from context
  const { username } = context.params;
  const userId = await getIdFromUsername(username); // Use await to get the resolved value
  console.log("outside", userId);

  const token = context.req.cookies.token;

  // If there's no token, return immediately with userId set to null
  if (!token) {
    return {
      props: {
        userId: null,
        loggedInUserId: null,
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
        loggedInUserId: null,
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

  // If no userId is provided, handle this case
  return {
    notFound: true,
  };
}

export default UserPageIndex;
