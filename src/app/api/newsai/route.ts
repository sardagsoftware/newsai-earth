import { NextResponse } from "next/server";

// Gerçek projede buraya OpenAI veya başka bir AI API entegrasyonu eklenmeli
export async function GET() {
  // Örnek veri: AI ile özetlenmiş haberler
  const articles = [
    {
      title: "Yapay zeka, iklim değişikliğiyle mücadelede yeni yöntemler sunuyor.",
      summary: "AI tabanlı analizler, iklim verilerinin daha hızlı ve doğru yorumlanmasını sağlıyor.",
      category: "İklim",
      source: "https://climateai.com/news1"
    },
    {
      title: "Tarımda AI destekli verimlilik artışı dünya genelinde çiftçileri etkiliyor.",
      summary: "Çiftçiler, AI ile ürün tahmini ve hastalık tespiti yaparak verimliliği artırıyor.",
      category: "Tarım",
      source: "https://agri-ai.com/news2"
    },
    {
      title: "Biyoloji alanında AI ile genetik analizler hızlanıyor.",
      summary: "Genetik veriler AI ile daha hızlı ve ucuz şekilde analiz edilebiliyor.",
      category: "Bilim",
      source: "https://bioai.com/news3"
    },
    {
      title: "Kimya ve element araştırmalarında yapay zeka ile yeni keşifler yapıldı.",
      summary: "AI, kimyasal reaksiyonları ve element özelliklerini tahmin etmede kullanılıyor.",
      category: "Bilim",
      source: "https://chem-ai.com/news4"
    },
    {
      title: "Tarihsel veriler AI ile analiz edilerek yeni bakış açıları sunuluyor.",
      summary: "AI, eski metinleri ve arkeolojik buluntuları analiz ederek tarih araştırmalarına katkı sağlıyor.",
      category: "Tarih",
      source: "https://historyai.com/news5"
    },
    {
      title: "Teknolojide AI devrimi: Yeni nesil haber platformları yükseliyor.",
      summary: "Yapay zeka, haber toplama ve özetleme süreçlerini otomatikleştiriyor.",
      category: "Teknoloji",
      source: "https://techai.com/news6"
    }
  ];
  return NextResponse.json({ articles });
}
