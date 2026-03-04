import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "introvertwears",
    template: "%s | introvertwears",
  },
  description:
    "Minimal. Intentional. For those who speak softly and dress loudly.",
  keywords: ["fashion", "minimalist", "clothing", "streetwear", "introvertwears"],
  openGraph: {
    title: "introvertwears",
    description: "Minimal. Intentional. For those who speak softly and dress loudly.",
    siteName: "introvertwears",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
