import { ChannelLayout } from "@/page-components/layouts";
import Channel from "@/page-components/components/Channel/Channel";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

const ChannelIndex = ({ userId }) => {
  const router = useRouter();
  const { eventName } = router.query;
  return <Channel eventName={eventName} userId={userId} />;
};

ChannelIndex.Layout = ChannelLayout;

export default ChannelIndex;

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
