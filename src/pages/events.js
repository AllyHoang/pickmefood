import EventLayout from "@/page-components/layouts/EventLayout";
import EventPage from "@/page-components/components/EventComponent/EventComponent";
import jwt from "jsonwebtoken";

const EventIndex = ({ userId }) => {
  return <EventPage userId={userId}></EventPage>;
};

EventIndex.Layout = EventLayout;

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

export default EventIndex;
