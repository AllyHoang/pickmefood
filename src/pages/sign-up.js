//handle post request from signUpForm, remember to:
// - check if there is any existing email in database
// - hash the password

import SignUpForm from "@/page-components/components/signUpForm/SignUpForm";
const SignUp = () => {
  return <SignUpForm />;
};

export default SignUp;
