import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { TransitionProvider } from "@/lib/transition-context";
import { CartProvider } from "@/lib/context/cart-context";
import PageTransition from "@/components/ui/PageTransition";
import "./globals.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StyleFlow",
  description: "AI Fashion Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geist.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <TransitionProvider>
          <CartProvider>
            <PageTransition />
            <Header />
            <main className="flex-1 pb-16 lg:pb-0">{children}</main>
            <BottomNav />
          </CartProvider>
        </TransitionProvider>
      </body>
    </html>
  );
}
