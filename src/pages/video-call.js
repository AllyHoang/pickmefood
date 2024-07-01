import { VideoCallLayout } from "@/page-components/layouts/VideoCallLayout";
import VideoCall from "@/page-components/components/VideoCallComponent/VideoCall";
import jwt from "jsonwebtoken";

const VideoCallIndex = ({ userId, email, firstname, lastname, chatId }) => {
  return (
    <VideoCall
      userId={userId}
      email={email}
      firstname={firstname}
      lastname={lastname}
      chatId={chatId} // Pass chatId as props to VideoCall component
    />
  );
};

VideoCallIndex.Layout = VideoCallLayout;

export default VideoCallIndex;

export async function getServerSideProps(context) {
  // Fetch the token from context
  const token = context.req.cookies.token;
  const chatId = context.query.chatId || null;

  // If there's no token, return immediately with userId set to null
  if (!token) {
    return {
      props: {
        userId: null,
        email: "",
        firstname: "",
        lastname: "",
      },
    };
  }

  try {
    // If there's a token, decode it to get user information
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    // Extract userId from decoded token
    const userId = decodedToken.id;
    const email = decodedToken.email;
    const firstname = decodedToken.firstname || "";
    const lastname = decodedToken.lastname || "";

    // Pass userId and other props to the component
    return {
      props: {
        userId,
        email,
        firstname,
        lastname,
        chatId,
      },
    };
  } catch (error) {
    console.error("Error decoding JWT:", error.message);
    return {
      redirect: {
        destination: "/login", // Redirect to login page if there's an error
        permanent: false,
      },
    };
  }
}
