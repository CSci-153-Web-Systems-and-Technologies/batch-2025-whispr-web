export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-background flex min-h-screen p-8 box-border">
      {/* BRAND SECTION */}
      <div className="flex flex-col w-[40vw] gap-6.25 justify-center">
        {/* LOGO */}
        <div className='flex items-center h-max gap-3'>
          <img src="/whispr-final.png" alt=" Whispr Logo" className='h-10' /> 
          <span className='font-bold text-primary text-3xl'>WHISPR</span>
        </div>
        <div className="w-full">
          <p className='font-bold text-5xl leading-tight'>You are not alone.</p>
          <p className='text-lg mt-2'>Connect with someone nearby who understand</p>
        </div>
        <p className='text-sm text-muted-foreground -mt-3 w-full'>
          Whispr lets you share your thoughts or listen to others in your local community—an anonymous, judgment-free space built for connection.
        </p>
      </div>

      {/* FORM SECTION */}
      <div className="flex-1 flex justify-center items-center">
        Form Section
      </div>
      {/* {children} */}
    </main>
  );
}