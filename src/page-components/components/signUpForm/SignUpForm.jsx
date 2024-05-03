import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./SignUpForm.module.css";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in the missing boxes");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/users/signup", {
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
        console.log("User created successfully");
        router.push("/dashboard");
      } else if (res.status === 400) {
        const data = await res.json();
        alert(data.error);
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <h1 className={styles["header"]}> Welcome to PickMeFood </h1>
        <div>
          Already have an account? Log in{" "}
          <Link href="/sign-in" className={styles.link}>
            {" "}
            here{" "}
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
          className={styles["input-field"]}
          type="password"
        />

        <button type="submit" className={styles["submit-button"]}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
