import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-background flex max-sm:flex-col h-dvh w-screen p-0 sm:pl-20 box-border">
      {/* BRAND SECTION */}
      <div className="flex flex-col w-full sm:w-[40vw] p-6 gap-4 sm:gap-6.25 justify-center relative">
        <div className='flex items-center h-max gap-1 sm:gap-3'>
          <img src="/whispr-final.png" alt=" Whispr Logo" className='h-7 sm:h-10' /> 
          <span className='font-bold text-primary text-2xl sm:text-3xl'>WHISPR</span>
        </div>
        <div className="w-full">
          <p className='font-bold text-4xl sm:text-6xl leading-tight max-sm:mt-2'>You are not alone.</p>
          <p className='text-sm sm:text-lg mt-1 sm:mt-2'>Connect with someone nearby who understand</p>
        </div>
        <p className='text-xs sm:text-sm text-muted-foreground -mt-3 w-full'>
          Whispr lets you share your thoughts or listen to others in your local community—an anonymous, judgment-free space built for connection.
        </p>
        <Image src="/auth-img.svg" alt="Hero image for Authentication Page" width={450} height={100}
          className="mt-8 max-sm:hidden" />
      </div>

      {/* FORM SECTION */}
      <div className="flex-1 flex justify-center max-sm:pt-4 sm:items-center shadow-lg">
        {/* Form Holder */}
        <div className="flex flex-col items-center gap-4 max-sm:flex-1 sm:h-max sm:w-120 rounded-4xl sm:rounded-lg py-10 px-8 sm:px-12 max-sm:rounded-b-none border bg-white shadow-md">
          {children}
        </div>
      </div>
      {/* {children} */}
    </main>
  );
}