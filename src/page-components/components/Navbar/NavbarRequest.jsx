import Link from "next/link";
import styles from "./NavbarRequest.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.linkBox2}>
        <Link href={"/active-donation"}>Active Donations</Link>
      </div>
      <div className={styles.linkBox1}>
        <Link href={"/active-request"}>Active Requests</Link>
      </div>
    </nav>
  );
}
