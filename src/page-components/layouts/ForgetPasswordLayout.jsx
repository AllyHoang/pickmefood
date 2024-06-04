import React from "react";
import Head from "next/head";
import LandingPageNavbar from "../components/Navbar/LandingPageNavbar";
import GlobalNavbar from "../components/Navbar/GlobalNavbar";
import SignUpFormTest from "../components/signUpForm/SignUpFormTest";

export const ForgetPasswordLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Forget Password</title>
      </Head>
      <div>
        <div
          className="bg-gradient-to-tr from-sky-200 via-sky-300 to-sky-400 min-h-screen flex items-center justify-center"
        >
          <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-xl">
            <main className="flex p-6 w-full">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};
