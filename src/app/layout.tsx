import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACM Media Platform",
  description: "Media content platform",
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
