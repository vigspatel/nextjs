import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Demo Next JS",
    template: "%s | Demo Next JS",
  },
  description: "Demo Next JS frontend connected to a WordPress backend.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bluereeftech.com/demo-next-js",
    siteName: "Demo Next JS",
  },
  twitter: {
    card: "summary_large_image",
  },
};

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col pt-[72px] text-slate-900 bg-white">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
