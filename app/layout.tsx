import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alamku - Harmoni Lingkungan",
  description: "Alamku - Harmoni Lingkungan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}