import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./SignInForm.module.css";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in the missing boxes");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/users/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.ok) {
        console.log("Log In successfully");
        router.push("/dashboard");
      } else if (res.status === 401 || res.status === 400) {
        const data = await res.json();
        alert(data.error);
      } else {
        throw new Error("Failed to log in");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <h1>Log in to Pick Me Food</h1>
        <div>
          Don't have an account? Sign up{" "}
          <Link href="/sign-up" className={styles.link}>
            here
          </Link>
        </div>

        <label htmlFor="email" className={styles["label-text"]}>
          Email
        </label>
        <input
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          className={styles["input-field"]}
        />

        <label htmlFor="password" className={styles["label-text"]}>
          Password
        </label>
        <input
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className={styles["input-field"]}
        />
        <h2>Oh naw you forgot your password?</h2>
        <div>
          Reset{" "}
          <Link href="/forget-password" className={styles.link}>
            here!
          </Link>
        </div>
        <button type="submit" className={styles["submit-button"]}>
          Log In
        </button>
      </form>
    </div>
  );
}
