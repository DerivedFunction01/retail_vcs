import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Retail VCS — Version-Controlled Commerce Architecture",
  description:
    "A unified, event-sourced architecture for retail checkout, menu catalog, and warehouse inventory. Eliminate legacy middleware with DAG-based append-only deltas.",
  keywords: [
    "Retail VCS",
    "Event Sourcing",
    "Version Control",
    "Commerce Architecture",
    "DAG",
    "AI Agent Runtime",
    "POS",
    "Checkout",
    "Inventory Management",
  ],
  authors: [{ name: "Retail VCS Project" }],
  icons: {
    // from public/logo.svg
    icon: "/logo.svg" 
  },
  openGraph: {
    title: "Retail VCS — Version-Controlled Commerce Architecture",
    description:
      "A unified, event-sourced architecture for retail checkout, menu catalog, and warehouse inventory.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
