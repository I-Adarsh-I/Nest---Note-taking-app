import type { Metadata } from "next";
import { Toaster } from "sonner"

import { Geist, Geist_Mono, Poppins, Roboto } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"]
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  title: "Nest",
  description: "A home for all your notes",
  icons:{
    icon:[
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href:"/logo.svg"
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href:"/logo-dark.svg"
      },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.className} antialiased`}
      >
        <ConvexClientProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="nest-theme"
          >
            <Toaster position="top-right" />
        {children}
        </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
