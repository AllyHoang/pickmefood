import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./forgetPasswordForm.module.css";

export default function ForgetPasswordForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please fill in the missing boxes");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/users/forgetpassword/page",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );
      if (res.ok) {
        alert("Check your email!");
        router.push("/sign-in");
      } else if (res.status === 401 || res.status === 400) {
        const data = await res.json();
        alert(data.error);
      } else {
        throw new Error("Failed to send reset email");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <h1>Oh no! You forgot your password?</h1>
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
        <h1>Oops! I remember</h1>
        <div>
          Log in{" "}
          <Link href="/sign-in" className={styles.link}>
            here!
          </Link>
        </div>
        <button type="submit" className={styles["submit-button"]}>
          Reset!
        </button>
      </form>
    </div>
  );
}
