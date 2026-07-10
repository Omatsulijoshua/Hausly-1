import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hausly - Tenant & Landlord Connection Platform",
  description: "Find your next home or landlord easily with Hausly. Search apartments, villas, and houses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
