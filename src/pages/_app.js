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
import { NextAuthProvider } from "@/lib/Providers";
import { ImageProvider } from "@/lib/ImageContext";

function App({ Component, pageProps }) {
  const PageLayout =
    Component.Layout || LandingPageLayout || HomeLayout || ActiveDonationLayout;

  return (
    <RootLayout>
      <NextAuthProvider>
        <ImageProvider>
          <PageLayout {...pageProps}>
            <Component {...pageProps} />
            <ToastContainer />
          </PageLayout>
        </ImageProvider>
      </NextAuthProvider>
    </RootLayout>
  );
}

export default App;
