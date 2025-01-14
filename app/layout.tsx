import type {   Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Terminal",
  description: "Terminal application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head />
            <body
            className="bg-black font-sans antialiased"
            >
           {children}
           </body>
    </html>
  );
}
