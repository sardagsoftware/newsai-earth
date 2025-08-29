import { NextResponse } from "next/server";

// Gerçek projede buraya AI API entegrasyonu eklenmeli
export async function GET() {
  // Örnek veri: AI ile özetlenmiş tarım haberleri
  const articles = [
    {
      title: "AI ile tarımda verimlilik %20 arttı.",
      summary: "Yapay zeka destekli analizler, ürün verimini ve çiftçi gelirini artırıyor.",
      category: "Verimlilik",
      source: "https://agri-ai.com/verimlilik"
    },
    {
      title: "Dünya genelinde akıllı sulama sistemleri yaygınlaşıyor.",
      summary: "AI tabanlı sulama sistemleri, su kullanımını optimize ediyor.",
      category: "Sürdürülebilirlik",
      source: "https://agri-ai.com/sulama"
    },
    {
      title: "Yapay zeka, hastalık tespiti ve ürün tahmininde kullanılıyor.",
      summary: "AI ile hastalıklar erken tespit edilip ürün tahminleri daha isabetli yapılıyor.",
      category: "Hastalık",
      source: "https://agri-ai.com/hastalik"
    },
    {
      title: "Çiftçiler, AI destekli analizlerle maliyetleri düşürüyor.",
      summary: "Yapay zeka, maliyet analizi ve kaynak yönetiminde çiftçilere yardımcı oluyor.",
      category: "Teknoloji",
      source: "https://agri-ai.com/teknoloji"
    },
    {
      title: "Tarımda sürdürülebilirlik için AI tabanlı çözümler geliştiriliyor.",
      summary: "AI, sürdürülebilir tarım uygulamalarının yaygınlaşmasını sağlıyor.",
      category: "Sürdürülebilirlik",
      source: "https://agri-ai.com/surdurulebilirlik"
    }
  ];
  return NextResponse.json({ articles });
}
