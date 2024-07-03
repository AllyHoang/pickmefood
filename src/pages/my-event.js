import EventLayout from "@/page-components/layouts/EventLayout";
import MyEvents from "@/page-components/components/EventComponent/MyEvents";
import { jwtDecode } from "jwt-decode";

const MyEventIndex = ({ userId }) => {
  return <MyEvents userId={userId}></MyEvents>;
};

MyEventIndex.Layout = EventLayout;

export default MyEventIndex;

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
