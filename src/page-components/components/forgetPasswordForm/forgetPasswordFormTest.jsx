import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";

const validateEmail = (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) {
    return "Please enter a valid email address.";
  }
  return true;
};

export default function ForgetPasswordFormTest() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  async function onSubmit(values) {
    const { email } = values;
    try {
      const res = await fetch(
        "http://localhost:3000/api/users/forgetpassword",
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
        Swal.fire({
          text: "Check your email!",
        }).then(() => {
          router.replace("/sign-in");
        });
      } else if (res.status === 401 || res.status === 400) {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error,
        });
      } else {
        throw new Error("Failed to log in");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="flex flex-col justify-around gap-10 w-full">
        <Label className=" text-2xl font-bold"> Reset Password </Label>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={control}
              name="email"
              rules={{ validate: validateEmail }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@example.com"
                      {...field}
                    />
                  </FormControl>
                  {errors.email && (
                    <FormMessage>{errors.email.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-sky-500 text-white font-medium text-md"
            >
              Reset Password
            </Button>

            <p className=" mt-4">
              Remembered your password?{" "}
              <Link href="/sign-in" className="underline">
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </>
  );
}
