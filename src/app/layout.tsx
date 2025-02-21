import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carz",
  description:
    "Carz is an e-commerce platform for buying and selling cars, featuring user-friendly browsing, advanced search filters, secure payments, and a responsive design. It allows users to compare cars, manage profiles, and track purchases, while providing an intuitive admin panel for managing listings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
