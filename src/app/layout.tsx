import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://breachmark.vercel.app",
  ),
  title: "BreachMark — Interactive Defensive Simulator",
  description:
    "Blue-team incident simulator: 12 response credits, live attack timeline, and blast-radius graph. Pause the breach and deploy controls.",
  openGraph: {
    title: "BreachMark — Simulate. Respond. Get Marked.",
    description:
      "You get 12 response credits. The attack keeps moving. Pause the timeline and shrink the blast radius.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "BreachMark — Cyber SOC incident simulator",
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
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
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
