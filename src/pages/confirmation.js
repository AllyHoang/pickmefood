import { ConfirmationLayout } from "@/page-components/layouts";
import ConfirmationPage from "@/page-components/components/Confirmation/ConfirmationPage";
import jwt from "jsonwebtoken";

const ConfirmationIndex = ({ userId }) => {
  return <ConfirmationPage userId={userId} />;
};

ConfirmationIndex.Layout = ConfirmationLayout;

export default ConfirmationIndex;

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
