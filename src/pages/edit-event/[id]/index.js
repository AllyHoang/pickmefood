import EventLayout from "@/page-components/layouts/EventLayout";
import EditEventForm from "@/page-components/components/EventComponent/EditEventForm";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

const MyEventIndex = ({ userId }) => {
  const router = useRouter();
  const { id } = router.query;

  return <EditEventForm eventId={id} userId={userId}></EditEventForm>;
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
