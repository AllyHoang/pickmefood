"use client";
import { Button } from "@/components/ui/button";

export default function WelcomeMessage() {
  return (
    <>
      <div className="flex flex-col bg-gradient-to-tr from-sky-400 via-sky-500 to-sky-600 h-screen w-1/2 items-center">
        <div className="flex flex-col gap-10 items-center relative top-32">
          <p className="text-white text-[3.75rem] leading-[1] ml-7 self-start">
            Welcome to
          </p>
          <p className="text-white font-bold text-[8rem] leading-[1] ml-7 ">
            Pick Me Food
          </p>
          <p className="text-white text-[2.25rem] leading-[2.5rem] self-start ml-10">
            {" "}
            Support a cause. Nourish the future.
          </p>
          <Button className=" self-start ml-10 text-lg bg-white text-black hover:text-white focus:text-white hover:bg-sky-600 focus:bg-sky-600 rounded-3xl font-medium">
            {" "}
            Find a donation center near me
          </Button>
        </div>
        <p className=" absolute bottom-10 left-10 text-white self-start font-medium hover:underline focus:underline hover:cursor-pointer">
          About us
        </p>
      </div>
    </>
  );
}
