import { useForm } from "react-hook-form";
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
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "@/redux/user/userSlice";
import { cn } from "@/lib/utils";

const validateEmail = (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) {
    return "Please enter a valid email address.";
  }
  return true;
};

// const validatePassword = (value) => {
//   if (value.length < 6) {
//     return "Password must be at least 6 characters.";
//   }
//   return true;
// };

export default function SignInFormTest() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  async function onSubmit(values) {
    const { email, password } = values;
    try {
      dispatch(signInStart());
      const res = await fetch("http://localhost:3000/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(signInSuccess(data.data));
        router.push("/dashboard");
      } else if (res.status === 401 || res.status === 400) {
        const data = await res.json();
        dispatch(signInFailure(data.error));
      } else {
        throw new Error("Failed to log in");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again later.");
    }
  }

  if (status === "authenticated") {
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Label className=" text-heading2-bold font-bold">
          {" "}
          Log In to Pick Me Food{" "}
        </Label>
        <Label className=" text-base font-normal text-slate-500">
          Don't have an account? Sign up{" "}
          <Link className="underline" href="/sign-up">
            here
          </Link>
        </Label>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={control}
            name="email"
            rules={{ validate: validateEmail }}
            className="w-full"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@example.com"
                    {...field}
                    className="w-3/4"
                  />
                </FormControl>
                <FormDescription>
                  Please enter your email address.
                </FormDescription>
                {errors.email && (
                  <FormMessage>{errors.email.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    {...field}
                    className="w-3/4"
                  />
                </FormControl>
                <div className="flex flex-row justify-between items-center w-3/4">
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="w-3 h-3 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-x-small text-gray-600"
                    >
                      Remember me
                    </label>
                  </div>
                  <FormDescription className="underline">
                    <Link href="/forget-password"> Forgot password? </Link>
                  </FormDescription>
                </div>
                {errors.password && (
                  <FormMessage>{errors.password.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-sky-500 font-medium w-3/4 shadow-lg"
          >
            Sign In
          </Button>
          <div className="flex items-center my-4 w-3/4 ">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex flex-col gap-4 font-medium">
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-2 shadow-md rounded-lg pl-3 py-2 w-3/4 border border-gray-200 justify-center"
            >
              <Image
                src="/google-logo.png"
                height={24}
                width={24}
                alt="Google Logo"
              />
              <span className="text-gray-700">Sign in with Google</span>
            </button>
            <button
              onClick={() => signIn("facebook")}
              className="flex items-center gap-2 shadow-md rounded-lg pl-3 py-2 w-3/4 border border-gray-200 justify-center"
            >
              <Image
                src="/facebook-logo.png"
                height={24}
                width={24}
                alt="Facebook Logo"
              />
              <span className="text-gray-700">Sign in with Facebook</span>
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
