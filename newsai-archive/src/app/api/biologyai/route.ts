import { NextResponse } from "next/server";

// Gerçek projede buraya AI API entegrasyonu eklenmeli
export async function GET() {
  // Örnek veri: AI ile özetlenmiş biyoloji haberleri
  const articles = [
    {
      title: "AI ile genetik analizler daha hızlı ve ucuz hale geliyor.",
      summary: "Yapay zeka, genetik analizlerde hız ve maliyet avantajı sağlıyor.",
      category: "Genetik",
      source: "https://bioai.com/genetik"
    },
    {
      title: "Biyoinformatikte yapay zeka ile yeni algoritmalar geliştirildi.",
      summary: "AI, biyoinformatik alanında yeni algoritmaların geliştirilmesini sağlıyor.",
      category: "Biyoinformatik",
      source: "https://bioai.com/biyoinformatik"
    },
    {
      title: "AI, hastalık teşhisinde biyologlara yardımcı oluyor.",
      summary: "Yapay zeka, hastalık teşhisinde biyologlara destek oluyor.",
      category: "Hastalık",
      source: "https://bioai.com/hastalik"
    },
    {
      title: "Biyoloji eğitiminde AI tabanlı simülasyonlar yaygınlaşıyor.",
      summary: "AI, biyoloji eğitiminde simülasyonlarla öğrenmeyi kolaylaştırıyor.",
      category: "Simülasyon",
      source: "https://bioai.com/simulasyon"
    },
    {
      title: "AI ile hücre ve protein analizleri daha hassas yapılıyor.",
      summary: "Yapay zeka, hücre ve protein analizlerinde hassas sonuçlar sunuyor.",
      category: "Genetik",
      source: "https://bioai.com/genetik2"
    }
  ];
  return NextResponse.json({ articles });
}
