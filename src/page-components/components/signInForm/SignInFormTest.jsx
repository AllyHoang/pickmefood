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
  const router = useRouter();
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
      const res = await fetch("http://localhost:3000/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
      alert("An error occurred. Please try again later.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Label className=" text-2xl font-bold"> Log In to Pick Me Food </Label>
        <Label className=" text-base font-normal text-slate-500">
          {" "}
          Don't have an account? Sign up{" "}
          <Link className="underline" href="/sign-up">
            {" "}
            here
          </Link>
        </Label>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <div className="flex flex-row justify-between">
                  <FormDescription>
                    Your password must be at least 6 characters.
                  </FormDescription>

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
          <Button type="submit" className="bg-sky-500 font-medium w-1/3">
            Log in to your account
          </Button>
        </form>
      </Form>
    </div>
  );
}
