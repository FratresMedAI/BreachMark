import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://breachmark.vercel.app",
  ),
  title: "BreachMark — Cyber SOC Command Center",
  description:
    "Simulate a live breach, spend response credits, and prove containment decisions in a premium cyber SOC dashboard.",
  openGraph: {
    title: "BreachMark — Simulate. Spend credits. Get Marked.",
    description:
      "A recruiter-ready cyber SOC command center with deterministic replay, blast-radius graphing, and a cinematic scorecard.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "BreachMark cyber SOC command center preview",
      },
    ],
  },
  icons: {
    icon: "/breachmark-logo.png",
    apple: "/breachmark-logo.png",
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
      className={`${inter.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground selection:bg-primary/25 selection:text-foreground">
        <div className="flex min-h-full flex-1 flex-col">{children}</div>
        <SiteFooter />
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            classNames: {
              toast:
                "bm-panel border-primary/30! bg-card/95! text-foreground!",
            },
          }}
        />
      </body>
    </html>
  );
}
