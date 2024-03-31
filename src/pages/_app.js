import "@/styles/globals.css";
import { HomeLayout } from "@/page-components/layouts";
import { ActiveDonationLayout } from "@/page-components/layouts";

const App = ({ Component, pageProps }) => {
  const PageLayout = Component.Layout || HomeLayout || ActiveDonationLayout;

  return (
    <PageLayout {...pageProps}>
      <Component {...pageProps} />
    </PageLayout>
  );
};

export default App;
