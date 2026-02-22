import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import NavigationBar from "@/components/NavigationBar";
import { I18nProviderClient } from "../../../locales/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bromelia – Juegos de Mesa",
  description: "Plataforma de juegos de mesa. Juega a Plantas y muchos más.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-sans)]`}
      >
        <I18nProviderClient locale={locale}>
          <NavigationBar />
          {children}
        </I18nProviderClient>
      </body>
    </html>
  );
}
