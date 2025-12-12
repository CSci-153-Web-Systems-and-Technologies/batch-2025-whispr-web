"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingScreen() {
  const router = useRouter();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedLanding");
    if (hasVisited) {
      router.replace("/login");
    } else {
      localStorage.setItem("hasVisitedLanding", "true");
    }
  }, [router]);
  return (
    <div className="flex flex-col min-h-screen items-start justify-start p-8 sm:px-25 bg-background">
      <div className="flex items-center justify-start w-full gap-2">
        <img src="/whispr-final.png" alt="Whispr Logo" className="h-9 aspect-square"/>
        <span className="text-primary font-semibold text-2xl mb-1">WHISPR</span>
      </div>
      <div className="flex max-sm:flex-col gap-8 sm:gap-20 w-full h-max sm:h-[70vh] max-sm:mt-12">
        <div className="flex flex-col justify-center sm:mb-10 gap-3 sm:gap-6.25">
          <h1 className="font-bold text-4xl sm:text-7xl text-foreground">Say It Without Saying Who.</h1>
          <p className="text-muted-foreground ">Connect with someone nearby who understands — safely, anonymously, and without judgment.</p>
          <Link href="/login" className="sm:mx-auto">
            <Button className="w-full sm:w-100 mx-auto mt-8 cursor-pointer text-base" size="lg">Get Started</Button>
          </Link>
        </div>
        <Image src="/chatting-vector.svg" height={500} width={500} alt="Vent to someone anonymously" className="max-sm:mt-10"/>
      </div>

      <h1 className="text-2xl sm:text-4xl text-center font-bold w-full sm:w-max max-sm:mt-12 mt-0 py-2 rounded-lg ">Core Features</h1>
      <Separator className="w-full mb-10"/>
      <div className="flex max-sm:flex-col justify-center items-center gap-3">
        <div className="flex flex-col items-center justify-center bg-white border shadow-md rounded-lg h-max sm:h-80 w-full p-7">
          <img src="/lock.svg" alt="Padlock" className="w-15 aspect-square"/>
          <p className="text-2xl md:text-lg font-semibold mt-3 text-center">Anonymous & Safe</p>
          <p className="text-base text-center mt-1">
            System-generated IDs keep you private and judgment-free.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-white border shadow-md rounded-lg h-max sm:h-80 w-full p-7">
          <img src="/pin.svg" alt="Pin Location" className="w-15 aspect-square"/>
          <p className="text-2xl md:text-lg font-semibold mt-3 text-center">Nearby Connections</p>
          <p className="text-base text-center mt-1">
            Matched with people in your local community.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-white border shadow-md rounded-lg h-max sm:h-80 w-full p-7">
          <img src="/clock.svg" alt="Alarm Clock" className="w-15 aspect-square"/>
          <p className="text-2xl md:text-lg font-semibold mt-3 text-center">Timed Chats</p>
          <p className="text-base text-center mt-1">
            Focused 10-minute sessions you can extend together.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-white border shadow-md rounded-lg h-max sm:h-80 w-full p-7">
          <img src="/home.svg" alt="Padlock" className="w-15 aspect-square"/>
          <p className="text-2xl md:text-lg font-semibold mt-3 text-center">Community Wall</p>
          <p className="text-base text-center mt-1">
            Post your thoughts and react with empathy.
          </p>
        </div>
      </div>
    </div>
  );
}
