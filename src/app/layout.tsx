import "../globals.css";
import NavBar from "../components/NavBar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "newsai.earth | Yapay Zeka Destekli Bilimsel Haber Platformu",
  description: "Dünya genelinden yapay zeka ile özetlenmiş haberler, tarım, iklim, elementler, kimya, biyoloji ve tarih alanlarında modern içerik.",
  keywords: ["haber", "yapay zeka", "bilim", "tarım", "iklim", "element", "kimya", "biyoloji", "tarih", "nextjs", "vercel"],
  openGraph: {
    title: "newsai.earth | Yapay Zeka Destekli Bilimsel Haber Platformu",
    description: "Dünya genelinden yapay zeka ile özetlenmiş haberler ve bilimsel içerik.",
    url: "https://newsai.earth",
    siteName: "newsai.earth",
    images: [
      {
        url: "https://newsai.earth/og-image.png",
        width: 1200,
        height: 630,
        alt: "newsai.earth logo"
      }
    ],
    locale: "tr_TR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "newsai.earth | Yapay Zeka Destekli Bilimsel Haber Platformu",
    description: "Dünya genelinden yapay zeka ile özetlenmiş haberler ve bilimsel içerik.",
    site: "@newsai_earth",
    images: ["https://newsai.earth/og-image.png"]
  },
  alternates: {
    canonical: "https://newsai.earth"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* SEO için JSON-LD scripti CSP nedeniyle kaldırıldı */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: '#18181b', color: '#ededed', minHeight: '100vh', margin: 0 }}
      >
        <NavBar />
        <div className="mt-4">
          {children}
        </div>
      </body>
    </html>
  );
}
