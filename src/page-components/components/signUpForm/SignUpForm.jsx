import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const validateEmail = (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) {
    return "Please enter a valid email address.";
  }
  return true;
};

const validatePassword = (value) => {
  if (value.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return true;
};

const validateConfirmPassword = (value, getValues) => {
  if (value !== getValues().password) {
    return "Passwords do not match.";
  }
  return true;
};

export default function SignUpForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = form;

  async function onSubmit(values) {
    try {
      const res = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
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
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Label className=" text-2xl font-bold"> Sign Up for Pick Me Food </Label>
        <Label className=" text-base font-normal text-slate-500">
          Already have an account? Log in{" "}
          <Link className="underline" href="/sign-in">
            here
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
            autoComplete="off"
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
            autoComplete="off"
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
          autoComplete="off"
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
          autoComplete="off"
          type="password"
        />

        <label htmlFor="confirm-password" className={styles["label-text"]}>
          Confirm Password
        </label>
        <input
          id="confirm-password"
          name="confirm-password"
          value={user.confirmPassword}
          autoComplete="off"
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
