import { AddItemLayout } from "@/page-components/layouts";
import AddItem from "@/page-components/components/AddItemForm/AddItemForm";
import { jwtDecode } from "jwt-decode"; // Import jwt_decode library
import { useEffect } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import jwt from "jsonwebtoken";

const AddItemIndex = ({ userId }) => {
  const router = useRouter();
  useEffect(() => {
    // Redirect to login if userId is not available (not authenticated)
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You must be logged in to access this page",
      }).then(() => {
        router.replace("/"); // Redirect to login page
      });
    }
  }, [userId, router]);

  // Render the component only if userId is available
  return userId ? <AddItem userId={userId} /> : null;
};

AddItemIndex.Layout = AddItemLayout;

export default AddItemIndex;

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
