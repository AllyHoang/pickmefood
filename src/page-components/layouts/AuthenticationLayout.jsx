import React from "react";
import Head from "next/head";
import WelcomeMessage from "../components/WelcomeMessage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const AuthenticationLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Sign In</title>
      </Head>
      <div>
        <div className="flex flex-row items-center justify-around left-0">
          <WelcomeMessage></WelcomeMessage>
          <Button className="absolute top-10 right-10 bg-white text-black hover:bg-sky-300 ">
            <Link href="/sign-up">Create an account</Link>
          </Button>
          <main className="w-1/2 p-20 self-center">{children}</main>
        </div>
      </div>
    </>
  );
};
