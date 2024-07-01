import { MapLayout } from "@/page-components/layouts";
import MapComponent from "@/page-components/components/MapDonation/mapComponent";
import { jwtDecode } from "jwt-decode";

const MapIndex = ({ userId }) => {
  return <MapComponent userId={userId}></MapComponent>;
};

MapIndex.Layout = MapLayout;

export default MapIndex;

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
