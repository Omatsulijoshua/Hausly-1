import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hausly",
  description: "Find homes, review listings, and connect with landlords.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
