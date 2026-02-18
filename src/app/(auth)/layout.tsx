import Image from "next/image";
import authLogo from "@/assets/autho logo.svg";

export default function OsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-10 px-11 pt-11">
        <Image src={authLogo} alt="logo" width={150} height={150} />
      </header>

      {children}
    </main>
  );
}
