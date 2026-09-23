import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nurse Robot Screen",
  description: "Expressive fullscreen nurse robot display interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-black antialiased overflow-hidden">
      <body className="h-full w-full overflow-hidden bg-black select-none m-0 p-0">
        {children}
      </body>
    </html>
  );
}
