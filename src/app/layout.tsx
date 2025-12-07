import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sanjay Itta Udhyog",
  description: "Manufacturing Management System",
};

import { TranslationProvider } from "@/context/TranslationContext";
import TranslationPopup from "@/components/TranslationPopup";

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <TranslationProvider>
          <TranslationPopup />
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
