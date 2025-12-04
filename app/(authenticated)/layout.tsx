import { HeaderWrapper } from "@/components/HeaderWrapper";
import { SessionTimerProvider } from "@/context/SessionTimerContext";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <SessionTimerProvider>
      <main>
        <HeaderWrapper />
        {children}
      </main>
    </SessionTimerProvider>
  )
}