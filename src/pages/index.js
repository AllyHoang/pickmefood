import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { HomeLayout } from "@/page-components/layouts";

const HomeIndex = () => {
  return (
    <div className={styles.container}>
      <div className={styles.appBar}>
        <Link href="/api/items/1/page">Click for page two!</Link>
      </div>
      <div className={styles.mainContent}>
        <h1>This is your home page.</h1>
      </div>
    </div>
  );
};

HomeIndex.Layout = HomeLayout;

export default HomeIndex;
