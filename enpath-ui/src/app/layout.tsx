import type { Metadata } from "next";
import { Inter, Nunito, Roboto_Mono } from "next/font/google";
import "./globals.css";

// Inter = interface text (font-family/sans); Nunito = display and large headings
// (font-family/display); Roboto Mono = machine text (font-family/mono).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enpath",
  description: "Enpath prototype: My Career (employee) and Setup (admin).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${nunito.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
