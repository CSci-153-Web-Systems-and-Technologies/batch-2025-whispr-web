import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingScreen() {
  return (
    <div className="flex flex-col min-h-screen items-start justify-start bg-background relative p-8">
      <div className="flex items-center justify-start w-full gap-2">
        <img src="/whispr-final.png" alt="Whispr Logo" className="h-9 aspect-square"/>
        <span className="text-primary font-semibold text-2xl mb-1">WHISPR</span>
      </div>
      <div className="grid grid-cols-[3fr_5fr] gap-20 w-full flex-1 min-h-0">
        <div className="flex flex-col justify-center mb-10 gap-6.25">
          <h1 className="font-bold text-7xl text-foreground">Say It Without Saying Who.</h1>
          <p className="text-muted-foreground ">Connect with someone nearby who understands — safely, anonymously, and without judgment.</p>
          <Button className="w-full mx-auto mt-8 cursor-pointer text-base" size="lg">Get Started</Button>
        </div>
        <div className="flex justify-center items-center ml-auto">
          <div className="grid grid-cols-2 w-auto gap-6.75 -mt-6">
           <div className="flex flex-col items-center justify-center bg-secondary rounded-lg h-80 w-full p-7">
              <img src="/lock.svg" alt="Padlock" className="w-15 aspect-square"/>
              <p className="text-2xl font-semibold mt-3">Anonymous & Safe</p>
              <p className="text-base text-center mt-1">
                System-generated IDs keep you private and judgment-free.
              </p>
            </div>
           <div className="flex flex-col items-center justify-center bg-secondary rounded-lg h-80 w-full p-7">
              <img src="/pin.svg" alt="Pin Location" className="w-15 aspect-square"/>
              <p className="text-2xl font-semibold mt-3">Nearby Connections</p>
              <p className="text-base text-center mt-1">
                Matched with people in your local community.
              </p>
            </div>
           <div className="flex flex-col items-center justify-center bg-secondary rounded-lg h-80 w-full p-7">
              <img src="/clock.svg" alt="Alarm Clock" className="w-15 aspect-square"/>
              <p className="text-2xl font-semibold mt-3">Timed Chats</p>
              <p className="text-base text-center mt-1">
                Focused 10-minute sessions you can extend together.
              </p>
            </div>
           <div className="flex flex-col items-center justify-center bg-secondary rounded-lg h-80 w-full p-7">
              <img src="/home.svg" alt="Padlock" className="w-15 aspect-square"/>
              <p className="text-2xl font-semibold mt-3">Community Wall</p>
              <p className="text-base text-center mt-1">
                Post your thoughts and react with empathy.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
