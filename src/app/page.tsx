import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-8 flex flex-col items-center justify-center">
      <main className="flex flex-col gap-8 items-center w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-center">newsai.earth</h1>
        <p className="mb-8 text-lg text-center">Yapay zeka destekli, yeni nesil haber ve bilim platformu</p>
        <nav className="w-full">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li><a href="/news" className="block bg-white rounded-lg shadow p-4 hover:bg-blue-100 transition">🌍 Dünya Haberleri & AI</a></li>
            <li><a href="/agriculture" className="block bg-white rounded-lg shadow p-4 hover:bg-green-100 transition">🌱 Tarım & AI</a></li>
            <li><a href="/climate" className="block bg-white rounded-lg shadow p-4 hover:bg-cyan-100 transition">🌦️ İklim Değişikliği & AI</a></li>
            <li><a href="/elements" className="block bg-white rounded-lg shadow p-4 hover:bg-yellow-100 transition">🧪 Elementler & Bilim</a></li>
            <li><a href="/chemistry" className="block bg-white rounded-lg shadow p-4 hover:bg-pink-100 transition">🔬 Kimya & AI</a></li>
            <li><a href="/biology" className="block bg-white rounded-lg shadow p-4 hover:bg-lime-100 transition">🧬 Biyoloji & AI</a></li>
            <li><a href="/history" className="block bg-white rounded-lg shadow p-4 hover:bg-orange-100 transition">📜 Tarih & AI</a></li>
          </ul>
        </nav>
      </main>
      <footer className="mt-12 text-sm text-gray-500 text-center">
        newsai.earth &copy; 2025 - Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
