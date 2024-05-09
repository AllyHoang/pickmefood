import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { HomeLayout, LandingPageLayout } from "@/page-components/layouts";
import LandingPage from "@/page-components/components/LandingPage/LandingPage";

const HomeIndex = () => {
  return <LandingPage> </LandingPage>;
};

// HomeIndex.Layout = HomeLayout;
HomeIndex.Layout = LandingPageLayout;

export default HomeIndex;
