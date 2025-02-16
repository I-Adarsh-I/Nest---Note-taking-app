import type { Metadata } from "next";
import { Toaster } from "sonner";

import { Roboto } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Nest",
  description: "A home for all your notes",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/nest-icon-black.svg",
        href: "/nest-icon-black.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/nest-icon-white.svg",
        href: "/nest-icon-white.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="nest-theme"
            >
              <Toaster position={"top-right"} />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
