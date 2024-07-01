import { ProfilePageLayout } from "@/page-components/layouts";
import Profile from "@/page-components/components/UserPage/ProfileComponent";
import jwt from "jsonwebtoken";

const ProfileIndex = ({ userId }) => {
  return <Profile userId={userId} />;
};

ProfileIndex.Layout = ProfilePageLayout;

export default ProfileIndex;

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
