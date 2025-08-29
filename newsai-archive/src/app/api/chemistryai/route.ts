import { NextResponse } from "next/server";

// Gerçek projede buraya AI API entegrasyonu eklenmeli
export async function GET() {
  // Örnek veri: AI ile özetlenmiş kimya haberleri
  const articles = [
    {
      title: "Yapay zeka ile kimyasal reaksiyonlar daha hızlı analiz ediliyor.",
      summary: "AI, kimyasal reaksiyonları hızlıca analiz ederek yeni bulgular sunuyor.",
      category: "Reaksiyon",
      source: "https://chem-ai.com/reaksiyon"
    },
    {
      title: "AI, yeni ilaç keşiflerinde kimyagerlere yardımcı oluyor.",
      summary: "Yapay zeka, ilaç keşif süreçlerinde kimyagerlere destek oluyor.",
      category: "İlaç",
      source: "https://chem-ai.com/ilac"
    },
    {
      title: "Kimya laboratuvarlarında AI tabanlı otomasyon yaygınlaşıyor.",
      summary: "AI, laboratuvar otomasyonunda verimliliği artırıyor.",
      category: "Otomasyon",
      source: "https://chem-ai.com/otomasyon"
    },
    {
      title: "AI ile moleküler yapı tahminleri daha hassas yapılıyor.",
      summary: "Yapay zeka, moleküler yapı tahminlerinde hassas sonuçlar sağlıyor.",
      category: "Reaksiyon",
      source: "https://chem-ai.com/reaksiyon2"
    },
    {
      title: "Kimya eğitiminde AI destekli simülasyonlar kullanılıyor.",
      summary: "AI, kimya eğitiminde simülasyonlarla öğrenmeyi kolaylaştırıyor.",
      category: "Simülasyon",
      source: "https://chem-ai.com/simulasyon"
    }
  ];
  return NextResponse.json({ articles });
}
