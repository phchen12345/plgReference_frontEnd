import Script from "next/script";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { ColorModeSync } from "@/components/theme/ColorModeSync";
import Footer from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "plg_reference",
  description: "A Next.js dashboard starter for Taiwan basketball data.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ColorModeSync />
          <Header />
          {children}
          <Footer />
          <ChatWidget />
        </Providers>

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-MWMPRLSG8Y"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-MWMPRLSG8Y');
      `}
        </Script>
      </body>
    </html>
  );
}
