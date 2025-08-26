
import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 font-sans flex flex-col">
      <header className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
        <span className="mr-2">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="copilot-orange" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFB347">
                  <animate attributeName="stop-color" values="#FFB347;#FF7F50;#FFB347" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="1" stopColor="#FF7F50">
                  <animate attributeName="stop-color" values="#FF7F50;#FFB347;#FF7F50" dur="2s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#copilot-orange)" />
            <ellipse cx="20" cy="20" rx="10" ry="6" fill="#fff" opacity="0.15">
              <animate attributeName="rx" values="10;13;10" dur="2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="20" cy="20" rx="6" ry="10" fill="#fff" opacity="0.10">
              <animate attributeName="ry" values="10;13;10" dur="2s" repeatCount="indefinite" />
            </ellipse>
            <text x="10" y="26" fontSize="16" fontWeight="bold" fill="#fff">AI</text>
          </svg>
        </span>
        <span className="text-xl font-bold tracking-tight">newsai.earth</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Yapay Zeka Destekli Bilimsel Haber Platformu</h1>
          <p className="text-gray-400 text-center mb-4">Dünya genelinden AI ile özetlenmiş haberler ve bilimsel içerik.</p>
          <input type="text" placeholder="Komut veya anahtar kelime yazın..." className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4" />
          <nav className="w-full">
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <li><Link href="/news" className="block bg-gray-800 hover:bg-green-700 text-white rounded-lg shadow p-4 text-center transition">🌍 Haber & AI</Link></li>
              <li><Link href="/agriculture" className="block bg-gray-800 hover:bg-green-700 text-white rounded-lg shadow p-4 text-center transition">🌱 Tarım & AI</Link></li>
              <li><Link href="/climate" className="block bg-gray-800 hover:bg-green-700 text-white rounded-lg shadow p-4 text-center transition">🌦️ İklim & AI</Link></li>
              <li><Link href="/elements" className="block bg-gray-800 hover:bg-green-700 text-white rounded-lg shadow p-4 text-center transition">🧪 Element & Bilim</Link></li>
              <li><Link href="/chemistry" className="block bg-gray-800 hover:bg-green-700 text-white rounded-lg shadow p-4 text-center transition">🔬 Kimya & AI</Link></li>
              <li><Link href="/biology" className="block bg-gray-800 hover:bg-green-700 text-white rounded-lg shadow p-4 text-center transition">🧬 Biyoloji & AI</Link></li>
              <li><Link href="/history" className="block bg-gray-800 hover:bg-green-700 text-white rounded-lg shadow p-4 text-center transition">📜 Tarih & AI</Link></li>
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
}
