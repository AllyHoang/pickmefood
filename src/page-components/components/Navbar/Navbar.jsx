import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.linkBox1}>
        <Link href={"/"}>Active Requests</Link>
      </div>
      <div className={styles.linkBox2}>
        <Link href={"/addTopic"}>Active Donations</Link>
      </div>
    </nav>
  );
}
