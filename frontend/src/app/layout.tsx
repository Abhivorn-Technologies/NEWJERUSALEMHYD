import type { Metadata } from "next";
import { Roboto, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollObserver from "@/components/ScrollObserver";

export const metadata: Metadata = {
  title: "New Jerusalem Ministries",
  description: "Official Website",
};

const roboto = Roboto({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-poppins",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${poppins.variable}`}>
      <body className="bg-white min-h-screen flex flex-col" suppressHydrationWarning>
        <ScrollObserver />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
