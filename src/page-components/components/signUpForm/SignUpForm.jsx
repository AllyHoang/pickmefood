import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./SignUpForm.module.css";

export default function SignUpForm() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [buttonDisabled, setButtonDisable] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (
      user.firstName.length > 0 &&
      user.lastName.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.confirmPassword.length > 0
    ) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!firstName || !lastName || !email || !password) {
    //   alert("Please fill in the missing boxes");
    // }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(user.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (user.confirmPassword != user.password) {
      alert("Passwords don't match");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
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

        <div className={styles["name-container"]}>
          <label htmlFor="first-name" className={styles["label-text"]}>
            First Name
          </label>
          <input
            id="first-name"
            name="first-name"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            type="text"
            className={`${styles["input-field"]} ${styles["name-input-field"]}`} // Apply new class
          />

          <label htmlFor="last-name" className={styles["label-text"]}>
            Last Name
          </label>
          <input
            id="last-name"
            name="last-name"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            type="text"
            className={`${styles["input-field"]} ${styles["name-input-field"]}`} // Apply new class
          />
        </div>

        <label htmlFor="email" className={styles["label-text"]}>
          Email
        </label>
        <input
          id="email"
          name="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          type="text"
          className={styles["input-field"]}
        />

        <label htmlFor="password" className={styles["label-text"]}>
          Password
        </label>
        <input
          id="password"
          name="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className={styles["input-field"]}
          type="password"
        />

        <label htmlFor="confirm-password" className={styles["label-text"]}>
          Confirm Password
        </label>
        <input
          id="confirm-password"
          name="confirm-password"
          value={user.confirmPassword}
          onChange={(e) =>
            setUser({ ...user, confirmPassword: e.target.value })
          }
          className={styles["input-field"]}
          type="password"
        />

        <button
          type="submit"
          className={`${styles["submit-button"]} ${
            buttonDisabled ? styles["disabled-button"] : ""
          }`}
          disabled={buttonDisabled}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
