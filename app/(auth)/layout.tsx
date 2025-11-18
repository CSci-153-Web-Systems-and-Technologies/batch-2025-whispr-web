import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-background flex min-h-screen pl-20 box-border">
      {/* BRAND SECTION */}
      <div className="flex flex-col w-[40vw] gap-6.25 justify-center relative">
        <div className='flex items-center h-max gap-3'>
          <img src="/whispr-final.png" alt=" Whispr Logo" className='h-10' /> 
          <span className='font-bold text-primary text-3xl'>WHISPR</span>
        </div>
        <div className="w-full">
          <p className='font-bold text-6xl leading-tight'>You are not alone.</p>
          <p className='text-lg mt-2'>Connect with someone nearby who understand</p>
        </div>
        <p className='text-sm text-muted-foreground -mt-3 w-full'>
          Whispr lets you share your thoughts or listen to others in your local community—an anonymous, judgment-free space built for connection.
        </p>
        <Image src="/auth-img.svg" alt="Hero image for Authentication Page" width={450} height={100}
          className="mt-8" />
      </div>

      {/* FORM SECTION */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4 h-max w-120 rounded-lg py-10 px-12 border bg-white shadow-md">
          {children}
        </div>
      </div>
      {/* {children} */}
    </main>
  );
}