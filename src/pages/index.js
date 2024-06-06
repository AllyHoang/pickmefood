import { AuthenticationLayout, LandingPageLayout } from "@/page-components/layouts";
import LandingPage from "@/page-components/components/LandingPage/LandingPage";
import SignInFormTest from "@/page-components/components/signInForm/SignInFormTest";

const HomeIndex = () => {
  // return <LandingPage> </LandingPage>;
  return <SignInFormTest></SignInFormTest>
};

// HomeIndex.Layout = HomeLayout;
HomeIndex.Layout = AuthenticationLayout;

export default HomeIndex;
