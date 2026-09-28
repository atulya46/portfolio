import type { Metadata } from "next";
import { Hanken_Grotesk, Rozha_One, Space_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

// Rozha One: a heavy display face that also covers Devanagari, used for the
// name, headings and the vertical "संतुलन" on the homepage.
const rozha = Rozha_One({
  variable: "--font-rozha",
  weight: "400",
  subsets: ["latin", "devanagari"],
});

// Hanken Grotesk for reading; Space Mono as the typewriter "meta" voice.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atulya Arya",
  description: "Engineer, painter, reader, traveller. A portfolio and a personal log.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${rozha.variable} ${hanken.variable} ${spaceMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
