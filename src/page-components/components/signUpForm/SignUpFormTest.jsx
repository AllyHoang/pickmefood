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

export default function SignUpFormTest() {
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
        <Label className=" text-2xl font-bold">
          {" "}
          Sign Up for Pick Me Food{" "}
        </Label>
        <Label className=" text-base font-normal text-slate-500">
          Already have an account? Log in{" "}
          <Link className="underline" href="/sign-in">
            here
          </Link>
        </Label>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-row gap-10">
            <FormField
              control={control}
              name="firstName"
              rules={{ required: "First name is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John" {...field} />
                  </FormControl>
                  {errors.firstName && (
                    <FormMessage>{errors.firstName.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="lastName"
              rules={{ required: "Last name is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Doe" {...field} />
                  </FormControl>
                  {errors.lastName && (
                    <FormMessage>{errors.lastName.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="email"
            rules={{ validate: validateEmail }}
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
            rules={{ validate: validatePassword }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormDescription>
                  Your password must be at least 6 characters.
                </FormDescription>
                {errors.password && (
                  <FormMessage>{errors.password.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="confirmPassword"
            rules={{
              validate: (value) => validateConfirmPassword(value, getValues),
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                {errors.confirmPassword && (
                  <FormMessage>{errors.confirmPassword.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-sky-400 hover:bg-sky-500 font-lg text-md text-white text-center"
          >
            Create your account
          </Button>
        </form>
      </Form>
    </div>
  );
}
