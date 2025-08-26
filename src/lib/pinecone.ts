export async function upsertToPinecone(indexName: string, vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>) {
  const apiKey = process.env.PINECONE_API_KEY;
  const url = process.env.PINECONE_URL; // e.g. https://index-name.svc.region.pinecone.io
  if (!apiKey || !url) return;

  try {
    const body = { vectors };
    await fetch(`${url}/vectors/upsert`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.warn('pinecone upsert failed', e);
  }
}

export async function queryPinecone(url: string, apiKey: string, queryVector: number[], topK = 10) {
  try {
    const resp = await fetch(`${url}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Api-Key': apiKey },
      body: JSON.stringify({ vector: queryVector, topK }),
    });
    return await resp.json();
  } catch (e) {
    console.warn('pinecone query failed', e);
    return null;
  }
}
