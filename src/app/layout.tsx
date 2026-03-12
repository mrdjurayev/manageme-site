import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  variable: "--font-manrope",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/manrope-latin.woff2",
      weight: "200 800",
      style: "normal",
    },
  ],
  fallback: ["Arial", "sans-serif"],
});

const plexMono = localFont({
  variable: "--font-plex-mono",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/ibm-plex-mono-400-latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ibm-plex-mono-500-latin.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  fallback: ["Courier New", "monospace"],
});

export const metadata: Metadata = {
  title: "ManageMe LMS",
  description: "Personal learning management system",
  icons: {
    icon: [
      { url: "/icon.png?v=3", type: "image/png", sizes: "500x500" },
      { url: "/favicon.ico?v=3", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: "/icon.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${manrope.variable} ${plexMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
