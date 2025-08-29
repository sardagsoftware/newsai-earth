import { Decision } from "./schema";

// Örnek: Açık veri kaynaklarından veri çekme (gerçek projede fetch ile)
export async function fetchDecisions(): Promise<Decision[]> {
  // Burada gerçek API, RSS veya web scraping ile veri çekilecek
  // Demo: Statik örnek veri
  return [
    {
      country: "Türkiye",
      ministry: "Tarım",
      field: "Tarım",
      type: "Yasak",
      subject: "Pestisit X",
      description: "Pestisit X kullanımı 2025 itibariyle yasaklanmıştır.",
      date: "2025-08-26",
      source: "https://tarim.gov.tr/duyurular/pestisit-x-yasagi",
      language: "tr"
    },
    {
      country: "ABD",
      ministry: "Sağlık",
      field: "Sağlık",
      type: "Duyuru",
      subject: "COVID-19 Aşısı",
      description: "COVID-19 aşısı için yeni yönetmelik yayınlandı.",
      date: "2025-08-10",
      source: "https://cdc.gov/covid19-vaccine-update",
      language: "en"
    }
  ];
}
