import { HeaderWrapper } from "@/components/HeaderWrapper";
import { SessionProvider } from "@/context/SessionContext";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <SessionProvider>
      <main>
        <HeaderWrapper />
        {children}
      </main>
    </SessionProvider>
  )
}