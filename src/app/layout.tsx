import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grundsteuerbescheid-Prüfer",
  description: "Prüfen Sie Ihren Grundsteuerbescheid in wenigen Minuten – kostenlos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
