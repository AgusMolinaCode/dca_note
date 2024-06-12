import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "./QueryProvider";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DCA-note",
  description:
    "A captivating platform for Dollar Cost Averaging in cryptocurrencies. Track your crypto purchases and visualize your progress with intuitive charts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Navbar />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
