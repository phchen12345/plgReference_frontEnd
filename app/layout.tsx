import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { ColorModeSync } from "@/components/theme/ColorModeSync";

export const metadata: Metadata = {
  title: "Taiwan Basketball Data",
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
        </Providers>
      </body>
    </html>
  );
}
