export default function OsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-10 px-14 pt-14">
        <div>
          <h1 className="text-[56px] leading-[0.9] tracking-[0.1em] text-white">
            MYNE
          </h1>
          <p className="mt-1 text-[16px] font-medium tracking-[0.22em] text-[#c8ccd3] uppercase">
            Luxury Handbags
          </p>
        </div>
      </header>

      {children}
    </main>
  );
}
