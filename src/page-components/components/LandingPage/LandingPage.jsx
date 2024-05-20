import Head from "next/head";
import styles from "./LandingPage.module.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="background-color: rgb(255 255 12)">
      {/* <Head>
        <title>Food Items Donation App</title>
      </Head> */}
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Support a cause.
              <br />
              Nourish the future.
            </h1>
            <p className={styles.description}>
              Help local communities combat hunger. Donate food items,
              groceries, and essential supplies. Every contribution helps a
              pantry provide for those in need.
            </p>
            <button className={styles.ctaButton}>See local pantries</button>
            <p className={styles.ratingInfo}>
              Our commitment to support and efficiency has earned us recognition
              from local food banks and communities.
            </p>
          </div>
          <div className={styles.searchBar}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search local Donation Centers"
            />
            <button className={styles.searchButton}>Search</button>
          </div>
        </section>
      </main>
    </div>
  );
}
