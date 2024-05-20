// export default App;
import "@/styles/globals.css";
import {
  HomeLayout,
  LandingPageLayout,
  RootLayout,
} from "@/page-components/layouts";
import { ActiveDonationLayout } from "@/page-components/layouts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App({ Component, pageProps }) {
  const PageLayout =
    Component.Layout || LandingPageLayout || HomeLayout || ActiveDonationLayout;

  return (
    <PageLayout {...pageProps}>
      <Component {...pageProps} />
      <ToastContainer />
    </PageLayout>
  );
}

export default App;
