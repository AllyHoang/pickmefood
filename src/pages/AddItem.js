import { addItemLayout } from "@/page-components/layouts";
import AddItem from "@/page-components/components/addItemForm/addItemForm";
import { jwtDecode } from "jwt-decode"; // Import jwt_decode library

const AddItemIndex = ({ userId }) => {
  return <AddItem userId={userId} />;
};

AddItemIndex.Layout = addItemLayout;

export default AddItemIndex;

export async function getServerSideProps(context) {
  // Fetch the token from context
  const token = context.req.cookies.token;

  // Decode the token to get user information
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
