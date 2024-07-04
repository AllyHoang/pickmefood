import { ScanLayout } from "@/page-components/layouts";
import VideoScan from "@/page-components/components/VideoScan/VideoScan";
import jwt from "jsonwebtoken";

const VideoScanIndex = ({ userId }) => {
  return <VideoScan userId={userId} />;
};

VideoScanIndex.Layout = ScanLayout;

export default VideoScanIndex;

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
