import { NextResponse } from "next/server";

// Gerçek projede buraya AI API entegrasyonu eklenmeli
export async function GET() {
  // Örnek veri: AI ile özetlenmiş iklim haberleri
  const articles = [
    {
      title: "Yapay zeka ile iklim tahminleri daha isabetli hale geliyor.",
      summary: "AI tabanlı modeller, iklim değişikliğini daha doğru tahmin ediyor.",
      category: "Tahmin",
      source: "https://climateai.com/tahmin"
    },
    {
      title: "AI, karbon salınımı analizlerinde yeni standartlar oluşturuyor.",
      summary: "Yapay zeka, karbon salınımı verilerini analiz ederek sürdürülebilirlik sağlıyor.",
      category: "Karbon",
      source: "https://climateai.com/karbon"
    },
    {
      title: "Küresel ısınma verileri AI ile daha hızlı işleniyor.",
      summary: "AI, küresel ısınma verilerini hızlıca analiz ederek erken uyarı sağlıyor.",
      category: "Afet",
      source: "https://climateai.com/afet"
    },
    {
      title: "İklim değişikliğiyle mücadelede AI tabanlı projeler artıyor.",
      summary: "Yapay zeka, iklim değişikliğiyle mücadelede yeni projelerin geliştirilmesini sağlıyor.",
      category: "Sürdürülebilirlik",
      source: "https://climateai.com/surdurulebilirlik"
    },
    {
      title: "AI, afet erken uyarı sistemlerinde kritik rol oynuyor.",
      summary: "Yapay zeka, afet erken uyarı sistemlerinde veri analizi ile kritik rol oynuyor.",
      category: "Afet",
      source: "https://climateai.com/afet2"
    }
  ];
  return NextResponse.json({ articles });
}
