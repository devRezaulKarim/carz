import "./globals.css";
import { Mulish, Roboto } from "next/font/google";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
export const metadata: Metadata = {
  title: "Carz",
  description:
    "Carz is an e-commerce platform for buying and selling cars, featuring user-friendly browsing, advanced search filters, secure payments, and a responsive design. It allows users to compare cars, manage profiles, and track purchases, while providing an intuitive admin panel for managing listings.",
};

const mulish = Mulish({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          `overscroll-none bg-background antialiased`,
          roboto.variable,
          mulish.variable,
        )}
      >
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
