import { DashboardLayout } from "@/page-components/layouts";
import DashboardPage from "@/page-components/components/DashboardPage/DashboardPage";
import { jwtDecode } from "jwt-decode"; // Import jwt_decode library

const DashboardIndex = ({ userId }) => {
  return <DashboardPage userId={userId}></DashboardPage>;
};

DashboardIndex.Layout = DashboardLayout;

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
  const decodedToken = jwtDecode(token);

  // Extract userId from decoded token
  const userId = decodedToken.id;

  // Pass userId as props to the component
  return {
    props: {
      userId,
    },
  };
}

export default DashboardIndex;
