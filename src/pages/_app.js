import "@/styles/globals.css";
import {
  HomeLayout,
  LandingPageLayout,
  RootLayout,
  ActiveDonationLayout,
} from "@/page-components/layouts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextAuthProvider } from "@/lib/Providers";
import { ImageProvider } from "@/lib/ImageContext";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { NotificationProvider } from "@/page-components/components/knock/KnockProvider";
import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

function App({ Component, pageProps }) {
  const PageLayout = Component.Layout || LandingPageLayout;

  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (websiteId) {
      Crisp.configure(websiteId);
    } else {
      console.error('Crisp websiteId is not set');
    }
  }, []);

  return (
<RootLayout>
  <NextAuthProvider>
    <ImageProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NotificationProvider>
            <PageLayout {...pageProps}>
              <Component {...pageProps} />
              <ToastContainer />
            </PageLayout>
          </NotificationProvider>
        </PersistGate>
      </Provider>
    </ImageProvider>
  </NextAuthProvider>
</RootLayout>
  );
}

export default App;
