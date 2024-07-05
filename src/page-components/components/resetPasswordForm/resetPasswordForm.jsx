import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./ResetPasswordForm.module.css";
import { Button } from "@/components/ui/button";

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
          setVerified(true);
          const responseData = await res.json();
          const email = responseData.email;
          setEmail(email);
        } else if (res.status === 401 || res.status === 400) {
          const data = await res.json();
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
    <div className="bg-gradient-to-tr from-sky-200 via-sky-300 to-sky-400 min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-xl">
        <main className="flex p-6 w-full">
          <div className="flex flex-col justify-around gap-10 w-full">
            <label className="text-2xl font-bold">
              Let's reset your password!
            </label>
            <form onSubmit={handleSubmit} className="space-y-8">
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
              <Button
                type="submit"
                className="bg-sky-500 text-white font-semibold"
              >
                Reset!
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
