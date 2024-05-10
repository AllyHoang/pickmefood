import "@/styles/globals.css";
import { HomeLayout } from "@/page-components/layouts";
import { ActiveDonationLayout } from "@/page-components/layouts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = ({ Component, pageProps }) => {
  const PageLayout = Component.Layout || HomeLayout || ActiveDonationLayout;

  return (
    <PageLayout {...pageProps}>
      <Component {...pageProps} />
      <ToastContainer />
    </PageLayout>
  );
};

export default App;
