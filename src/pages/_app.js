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
import { Provider } from 'react-redux';
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
function App({ Component, pageProps }) {
  const PageLayout =
    Component.Layout || LandingPageLayout || HomeLayout || ActiveDonationLayout;
  return (
    <Provider store={store}>
      <PersistGate loading ={null} persistor={persistor}>
        <RootLayout>
          <PageLayout {...pageProps}>
            <Component {...pageProps} />
            <ToastContainer />
          </PageLayout>
        </RootLayout>
      </PersistGate>
    </Provider>
  );
}

export default App;
