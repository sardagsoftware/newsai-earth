import { NextResponse } from "next/server";

// Gerçek projede buraya AI API entegrasyonu eklenmeli
export async function GET() {
  // Örnek veri: AI ile özetlenmiş element, kimya ve biyoloji haberleri
  const articles = [
    {
      title: "AI ile yeni element keşifleri hızlandı.",
      summary: "Yapay zeka, yeni elementlerin keşfinde bilim insanlarına yardımcı oluyor.",
      category: "Keşif",
      source: "https://elementai.com/kesif"
    },
    {
      title: "Kimya alanında yapay zeka ile reaksiyon tahminleri geliştirildi.",
      summary: "AI, kimyasal reaksiyonları tahmin ederek laboratuvar süreçlerini hızlandırıyor.",
      category: "Kimya",
      source: "https://elementai.com/kimya"
    },
    {
      title: "Biyolojide AI ile protein analizleri daha hassas yapılıyor.",
      summary: "Yapay zeka, protein analizlerinde biyologlara hassas sonuçlar sunuyor.",
      category: "Biyoloji",
      source: "https://elementai.com/biyoloji"
    },
    {
      title: "Elementlerin özellikleri AI ile daha hızlı sınıflandırılıyor.",
      summary: "AI, elementlerin fiziksel ve kimyasal özelliklerini hızlıca analiz ediyor.",
      category: "Analiz",
      source: "https://elementai.com/analiz"
    },
    {
      title: "Kimya ve biyoloji verileri AI ile entegre analiz ediliyor.",
      summary: "Yapay zeka, kimya ve biyoloji verilerini bir arada analiz ederek yeni bulgular ortaya çıkarıyor.",
      category: "Analiz",
      source: "https://elementai.com/analiz2"
    }
  ];
  return NextResponse.json({ articles });
}
