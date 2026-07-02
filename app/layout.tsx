import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Low Carbon Materials Hub",
  description: "Concrete EPD comparison app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
