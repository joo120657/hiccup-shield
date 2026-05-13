import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "딸꾹뚝 (Hiccup Stop)",
  description: "인터랙티브 딸꾹질 케어 가이드",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "딸꾹뚝",
  },
  openGraph: {
    title: "딸꾹뚝 (Hiccup Stop)",
    description: "딸꾹질을 뚝! 멈추게 하는 스마트한 가이드",
    images: ["/icon.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "딸꾹뚝 (Hiccup Stop)",
    description: "딸꾹질을 뚝! 멈추게 하는 스마트한 가이드",
    images: ["/icon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1128",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable}`}>
      <body className="min-h-[100dvh] flex flex-col bg-[var(--color-deep-navy)] text-white overflow-hidden selection:bg-[var(--color-sky-blue)] selection:text-white">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
