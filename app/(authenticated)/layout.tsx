import { HeaderWrapper } from "@/components/HeaderWrapper";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <main>
      <HeaderWrapper />
      {children}
    </main>
  )
}