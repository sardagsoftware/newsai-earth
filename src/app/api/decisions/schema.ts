export type Decision = {
  country: string;
  ministry: string;
  field: string;
  type: string; // Yasak, İzin, Duyuru, Kısıtlama, vb.
  subject: string;
  description: string;
  date: string;
  source: string;
  language: string; // Orijinal dil
  translated?: {
    [lang: string]: {
      subject: string;
      description: string;
    }
  };
};

export const countries = [
  "Türkiye", "Almanya", "ABD", "Fransa", "Çin", "Japonya", "İngiltere", "Rusya", "Brezilya", "Hindistan", "Mısır", "Güney Afrika", "Avustralya", "Kanada", "İtalya", "İspanya", "İsveç", "Norveç", "Finlandiya", "Hollanda", "Belçika", "İsviçre", "Avusturya", "Polonya", "Macaristan", "Çekya", "Yunanistan", "İran", "Suudi Arabistan", "Endonezya", "Malezya", "Singapur", "Güney Kore", "Meksika", "Arjantin", "Şili", "Kolombiya", "Nijerya", "Kenya", "Fas", "Tunus", "Pakistan", "Bangladeş", "Vietnam", "Tayland", "Filipinler", "Ukrayna", "Romanya", "Portekiz", "Danimarka", "İrlanda", "Slovakya", "Slovenya", "Hırvatistan", "Sırbistan", "Bulgaristan", "Estonya", "Letonya", "Litvanya", "Lüksemburg", "Yeni Zelanda"
];

export const ministries = [
  "Tarım", "Sağlık", "Eğitim", "İçişleri", "Çevre", "Enerji", "Ulaştırma", "Sanayi", "Ticaret", "Adalet", "Dışişleri", "Kültür", "Turizm", "Gençlik ve Spor", "Maliye", "Çalışma", "Aile", "Sosyal Hizmetler", "Bilim", "Teknoloji", "Savunma", "Gümrük", "İletişim", "Finans", "Ekonomi", "İnşaat", "Bilişim", "Meteoroloji", "Afet", "Gıda", "Hayvancılık", "Orman", "Denizcilik", "Madencilik", "Uzay", "Yatırım", "İstihdam", "Sanat", "Halkla İlişkiler"
];

export const decisionTypes = [
  "Yasak", "İzin", "Duyuru", "Kısıtlama", "Tavsiye", "Yönetmelik", "Kanun", "Geçici Karar", "Sürekli Karar", "Uygulama", "Denetim", "İptal", "Onay", "Red", "Değişiklik"
];

export const languages = [
  "tr", "en", "de", "fr", "es", "ru", "zh", "ja", "ar", "pt", "it", "nl", "sv", "no", "fi", "pl", "el", "hu", "cs", "ro", "bg", "da", "ko", "id", "ms", "th", "vi", "uk", "fa", "he", "hi", "bn", "ur", "sw", "af"
];
