import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://breach-budget.vercel.app",
  ),
  title: "Breach Budget — Interactive Defensive Simulator",
  description:
    "Blue-team incident simulator: 12 response credits, live attack timeline, and blast-radius graph. Pause the breach and deploy controls.",
  openGraph: {
    title: "Breach Budget",
    description:
      "You get 12 response credits. The attack keeps moving. Pause the timeline and shrink the blast radius.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[#0a0f1a] font-sans text-foreground">
        {children}
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}
