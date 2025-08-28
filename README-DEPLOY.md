Vercel deploy checklist

1) Add required environment variables in Project Settings → Environment Variables

- OPENAI_API_KEY  (server only)
- NEXT_PUBLIC_BASE_URL  (optional, set to your production domain e.g. https://newsai.earth)
- PINECONE_API_KEY (optional, server)
- PINECONE_URL (optional, server)

2) Trigger a Deploy (push to main or use Vercel UI)

3) When you have the preview/production URL, run the smoke-test script locally:

```bash
# replace <preview-url> with the actual URL Vercel provides
scripts/smoke-test-deploy.sh https://<preview-url>.vercel.app "iklim değişikliği etkileri"
```

If you want me to run the smoke-test for you, paste the preview URL here and I will run it and report the `/api/search` response and CSP headers.
