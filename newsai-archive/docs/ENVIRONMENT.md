Environment variables for newsai.earth

Copy the values below into a `.env.local` file (DO NOT commit real secrets). On Vercel set these under Project -> Settings -> Environment Variables.

Required for core features:

- OPENAI_API_KEY
  - Purpose: LLM access (chat, embeddings, Whisper for STT).

Optional but recommended:

- PINECONE_API_KEY, PINECONE_ENV
  - Purpose: vector DB for semantic search.

- SUPABASE_URL, SUPABASE_SERVICE_KEY
  - Purpose: storage and optional vector DB.

- AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET
  - Purpose: file/media storage.

- DEEPL_API_KEY or GOOGLE_TRANSLATE_KEY + GOOGLE_PROJECT_ID
  - Purpose: high-quality translation pipeline (Decisions module).

- NEWSAPI_KEY, EVENTREGISTRY_KEY
  - Purpose: news ingestion helpers / source aggregation.

- SENTRY_DSN
  - Purpose: error monitoring.

Notes:
- Keep all real API keys out of git.
- For development, create a `.env.local` in repo root and add values.
- For deployment (Vercel), set the same variables in the Vercel dashboard.
- OPENAI_API_KEY is required for embedding-based reranking in `/api/search`.

Example `.env.local` snippet:

OPENAI_API_KEY=sk_xyz
PINECONE_API_KEY=...
SUPABASE_URL=https://...supabase.co

