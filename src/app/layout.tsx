import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import RestTimerPill from "@/components/RestTimerPill";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import { TimerProvider } from "@/lib/timer-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DC Fitness",
  description: "Personal fitness tracker — gym, running, supplements",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DC Fitness",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <link rel="icon" href="/icon-192.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <TimerProvider>
          <ServiceWorkerRegistrar />
          <main className="mx-auto max-w-lg px-4 pb-24 pt-6">{children}</main>
          <RestTimerPill />
          <BottomNav />
        </TimerProvider>
      </body>
    </html>
  );
}
