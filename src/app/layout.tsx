import type { Metadata } from "next";
import { Quicksand, Inter } from "next/font/google";
import "./globals.css";
import { QuickNav } from "@/components/QuickNav";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-quicksand",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fennby — Every child, seen.",
  description:
    "A fully transparent, whole-child education ecosystem: mock exams, vetted tutors, real parent visibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${inter.variable} font-body antialiased bg-mist-50 text-charcoal-teal`}
      >
        {children}
        <QuickNav />
      </body>
    </html>
  );
}
