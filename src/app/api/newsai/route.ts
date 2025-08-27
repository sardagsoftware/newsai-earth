import { NextResponse } from "next/server";

// Gerçek projede buraya OpenAI veya başka bir AI API entegrasyonu eklenmeli
export async function GET(req: Request) {
  // Eğer ?openai_ping=1 parametresi varsa, prod lambdelerinden OpenAI'ye kısa bir ping yap
  try {
    const url = new URL(req.url);
    if (url.searchParams.get('openai_ping') === '1') {
      const key = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
      if (!key) {
        return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set in environment' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
      try {
        const r = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({ model: 'text-embedding-3-small', input: 'ping' }),
        });
        const text = await r.text();
        let json = null;
        try { json = text ? JSON.parse(text) : null; } catch (e) { json = null; }
        return new Response(JSON.stringify({ ok: r.ok, status: r.status, statusText: r.statusText, bodyText: (text||'').slice(0,2000), bodyJson: json }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: String(e), stack: e?.stack || null }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }
  } catch (e) {
    // devam et ve normal articles yanıtını dön
  }

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
