// Navbar.js
import Link from 'next/link';
import styles from './GlobalNavbar.module.css';

const GlobalNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <Link href="/" legacyBehavior>
          <a className={styles.brand}>Pick Me Food</a>
        </Link>
      </div>
      <div className={styles.navbarNav}>
        <ul className={styles.navbarNavLeft}>
          <li className={styles.navItem}>
            <Link href="/about" legacyBehavior>
              <a className={styles.navLink}>About Us</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/milestones" legacyBehavior>
              <a className={styles.navLink}>Our Milestones</a>
            </Link>
          </li>
        </ul>
        <ul className={styles.navbarNavRight}>
          <li className={styles.navItem}>
            <Link href="/signin" legacyBehavior>
              <a className={styles.signInButton}>Sign In</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default GlobalNavbar;
