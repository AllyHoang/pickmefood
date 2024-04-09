import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { HomeLayout } from "@/page-components/layouts";

const HomeIndex = () => {
  return (
    <div className={styles.container}>
      {/* AppBar */}
      <div className={styles.appBar}>
        <Link href="/items/1">Click for the page two!</Link>
      </div>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <h1>This is your home page.</h1>
      </div>
    </div>
  );
};

HomeIndex.Layout = HomeLayout;

export default HomeIndex;
