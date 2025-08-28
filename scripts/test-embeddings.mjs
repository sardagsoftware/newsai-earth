import OpenAI from "openai";

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
}

async function embedTexts(client, texts) {
  const batchSize = 32;
  const embeddings = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const resp = await client.embeddings.create({ model: 'text-embedding-3-small', input: batch });
    for (const d of resp.data) embeddings.push(d.embedding);
  }
  return embeddings;
}

(async function main(){
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not set in env');
    process.exit(2);
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const query = 'iklim değişikliği etkileri';

  const sampleResults = [
    { title: 'Yeni iklim raporu yayımlandı', summary: 'Buzulların erime hızı arttı, deniz seviyeleri yükseliyor.' },
    { title: 'Tarım ve kuraklık', summary: 'Kuraklık tarımsal verimi etkiledi; sulama ihtiyaçları arttı.' },
    { title: 'Teknoloji haberleri', summary: 'Yeni akıllı telefon tanıtıldı, pil ömrü artırıldı.' },
    { title: 'İklim politikaları', summary: 'Hükûmetler karbon emisyonlarını azaltma hedefleri açıkladı.' }
  ];

  console.log('Requesting query embedding...');
  const qResp = await client.embeddings.create({ model: 'text-embedding-3-small', input: query });
  const qEmb = qResp.data[0].embedding;

  const texts = sampleResults.map(r => (r.title + '\n' + r.summary).slice(0, 2000));
  console.log('Requesting embeddings for sample results...');
  const resEmb = await embedTexts(client, texts);

  const scored = sampleResults.map((r, i) => ({
    title: r.title,
    summary: r.summary,
    score: cosine(qEmb, resEmb[i])
  })).sort((a,b) => b.score - a.score);

  console.log('Top scored results:');
  console.log(JSON.stringify(scored, null, 2));
})();
