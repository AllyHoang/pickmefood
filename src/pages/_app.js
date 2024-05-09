// export default App;
import "@/styles/globals.css";
import {
  HomeLayout,
  LandingPageLayout,
  RootLayout,
} from "@/page-components/layouts";
import { ActiveDonationLayout } from "@/page-components/layouts";

function App({ Component, pageProps }) {
  const PageLayout =
    Component.Layout || LandingPageLayout || HomeLayout || ActiveDonationLayout;

  return (
    <RootLayout>
      <PageLayout {...pageProps}>
        <Component {...pageProps} />
      </PageLayout>
    </RootLayout>
  );
}

export default App;
