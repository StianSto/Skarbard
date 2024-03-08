import type { Metadata } from "next";
import { Inter, Luckiest_Guy } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const luckiestGuy = Luckiest_Guy({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-luckiestguy",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skårbård",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={` font-sans ${inter.variable} ${luckiestGuy.variable}`}
    >
      <body className="h-dvh">{children}</body>
    </html>
  );
}
