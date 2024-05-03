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
