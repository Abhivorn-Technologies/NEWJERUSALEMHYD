import type { Metadata } from "next";
import { Roboto, Poppins, Suranna, Ramabhadra, Mallanna, Tenali_Ramakrishna } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const suranna = Suranna({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-suranna",
});

const ramabhadra = Ramabhadra({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-ramabhadra",
});

const mallanna = Mallanna({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-mallanna",
});

const tenaliRamakrishna = Tenali_Ramakrishna({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-tenali",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${poppins.variable} ${suranna.variable} ${ramabhadra.variable} ${mallanna.variable} ${tenaliRamakrishna.variable}`}>
      <body className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
