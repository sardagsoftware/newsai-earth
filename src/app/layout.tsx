import "../globals.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import LocaleSetter from "../components/LocaleSetter";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from 'next/headers';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // read nonce from cookie set by middleware
  const cookieStore = await cookies();
  const nonce = cookieStore.get('csp-nonce')?.value ?? '';
  return (
    <html lang="tr">
      <head>
        {/* Provide nonce for any inline scripts if needed */}
        {nonce ? <meta name="csp-nonce" content={nonce} /> : null}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen m-0`}
      >
        <NavBar />
  <LocaleSetter />
        <main className="mt-4">
          {children}
        </main>
        <Footer />
        <noscript>
          <div style={{padding:16,background:'#111',color:'#fff',textAlign:'center'}}>JavaScript kapalı — bazı özellikler çalışmayabilir.</div>
        </noscript>
      </body>
    </html>
  );
}
