import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const leagueSpartan = localFont({
  src: [
    {
      path: "../public/league-spartan.bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-league-spartan",
});

export const metadata: Metadata = {
  title: "PharmaShe - Women's Drug Analysis",
  description: "Analyze drug interactions and their effects on women's health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${leagueSpartan.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
