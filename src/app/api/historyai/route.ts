import { NextResponse } from "next/server";

// Gerçek projede buraya AI API entegrasyonu eklenmeli
export async function GET() {
  // Örnek veri: AI ile özetlenmiş tarih haberleri
  const articles = [
    {
      title: "AI ile tarihsel belgeler analiz edilerek yeni bilgiler ortaya çıkarılıyor.",
      summary: "Yapay zeka, tarihsel belgeleri analiz ederek yeni bilgiler sunuyor.",
      category: "Metin",
      source: "https://historyai.com/metin"
    },
    {
      title: "Yapay zeka, arkeolojik buluntuların sınıflandırılmasında kullanılıyor.",
      summary: "AI, arkeolojik buluntuları hızlıca sınıflandırıyor.",
      category: "Arkeoloji",
      source: "https://historyai.com/arkeoloji"
    },
    {
      title: "Tarihsel olaylar AI ile daha hızlı ve kapsamlı inceleniyor.",
      summary: "Yapay zeka, tarihsel olayları hızlı ve kapsamlı şekilde inceliyor.",
      category: "Olay",
      source: "https://historyai.com/olay"
    },
    {
      title: "AI, eski metinlerin dijitalleştirilmesinde önemli rol oynuyor.",
      summary: "Yapay zeka, eski metinleri dijitalleştirerek erişimi kolaylaştırıyor.",
      category: "Metin",
      source: "https://historyai.com/metin2"
    },
    {
      title: "Tarih araştırmalarında AI tabanlı veri madenciliği yaygınlaşıyor.",
      summary: "AI, tarih araştırmalarında veri madenciliği ile yeni bulgular ortaya çıkarıyor.",
      category: "Veri Madenciliği",
      source: "https://historyai.com/verimadenciligi"
    }
  ];
  return NextResponse.json({ articles });
}
