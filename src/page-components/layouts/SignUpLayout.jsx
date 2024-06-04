import React from "react";
import Head from "next/head";

export const SignUpLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Sign Up</title>
      </Head>
      <div>
        <div
          className="bg-gradient-to-tr from-sky-200 via-sky-300 to-sky-400 min-h-screen flex items-center justify-center"
          // style={{ backgroundColor: "rgba(56, 189, 248, 0.7)" }}
        >
          <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-xl">
            <main className="flex p-6">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};
