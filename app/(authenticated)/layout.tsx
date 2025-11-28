import Navbar from "@/components/Navbar";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <main>
      <Navbar />
      {children}
    </main>
  )
}