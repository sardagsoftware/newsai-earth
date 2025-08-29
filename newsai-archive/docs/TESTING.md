Quick testing guide — newsai.earth

This file shows minimal steps to run the app locally and test the `/api/search` endpoint.

1) Run locally

- Install deps:

```bash
npm install
```

- Create a `.env.local` (optional) with `OPENAI_API_KEY=sk_...` if you want embedding-based ranking.

- Start dev server:

```bash
npm run dev
```

2) Test `/api/search` (JSON request)

- Basic POST (works even without OPENAI key — returns aggregated module results):

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"q":"iklim değişikliği"}'
```

- If you have `OPENAI_API_KEY` set in `.env.local` or in Vercel, the endpoint will perform embedding-based reranking.

3) Test with file upload (multipart)

```bash
curl -X POST http://localhost:3000/api/search \
  -F "q=iklim değişikliği" \
  -F "images=@./test/fixture.jpg"
```

4) Test on deployed Vercel preview

- After pushing to `main`, Vercel will create a preview URL. Use the same curl examples replacing `http://localhost:3000` with the preview URL.

Notes

- If you want to speed up embedding-based queries for production, configure Pinecone (add `PINECONE_API_KEY` and `PINECONE_URL`) and we already added optional upsert code to `/api/search`.
- If you see rate-limit or errors from OpenAI, the endpoint falls back to returning aggregated results without reranking.
