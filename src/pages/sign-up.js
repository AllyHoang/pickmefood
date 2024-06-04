//handle post request from signUpForm, remember to:
// - check if there is any existing email in database
// - hash the password

import SignUpFormTest from "@/page-components/components/SignUpForm/SignUpFormTest";
import { SignUpLayout } from "@/page-components/layouts";
const SignUp = () => {
  return <SignUpFormTest/>;
};

SignUp.Layout = SignUpLayout

export default SignUp;
