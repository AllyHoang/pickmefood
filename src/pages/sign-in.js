import SignInFormTest from "@/page-components/components/signInForm/SignInFormTest";
import { AuthenticationLayout } from "@/page-components/layouts/AuthenticationLayout";

const SignIn = () => {
  return <SignInFormTest />;
};

SignIn.Layout = AuthenticationLayout;
export default SignIn;
