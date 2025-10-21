export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-center min-h-screen w-full">{children}</div>
    </div>
  );
}
