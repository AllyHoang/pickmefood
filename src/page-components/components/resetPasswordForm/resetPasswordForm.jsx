import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./ResetPasswordForm.module.css";

export default function ResetPasswordForm({ id }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState(null);
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Added state for password match
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/users/verifytoken/${id}`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });
        if (res.ok) {
          alert("Verified!");
          setVerified(true);
          const responseData = await res.json();
          const email = responseData.email;
          setEmail(email);
        } else if (res.status === 401 || res.status === 400) {
          const data = await res.json();
          alert(data.error);
          setVerified(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    verifyToken();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return; // Exit early if passwords don't match
    }

    try {
      const res = await fetch("http://localhost:3000/api/users/resetpassword", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          password,
          email,
        }),
      });
      if (res.ok) {
        alert("Your password is reset!");
        router.push("/sign-in");
      } else if (res.status === 401 || res.status === 400) {
        const data = await res.json();
        alert(data.error);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <h1>Let's reset your password!</h1>
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
        <label htmlFor="confirmPassword" className={styles["label-text"]}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          className={styles["input-field"]}
        />
        {!passwordsMatch && (
          <p style={{ color: "red" }}>Passwords do not match!</p>
        )}
        <button type="submit" className={styles["submit-button"]}>
          Reset!
        </button>
      </form>
    </div>
  );
}
