# newsai.earth

Yapay zeka destekli, modern ve bilimsel haber platformu.

## Telif Hakkı ve Lisans

Bu proje MIT lisansı ile yayınlanmıştır. Tüm kodlar ve içerikler sardagsoftware tarafından 2025 yılında oluşturulmuştur. Detaylar için LICENSE dosyasına bakınız.

## Kullanım Şartları

Projeyi ticari ve kişisel amaçlarla kullanabilirsiniz. Kodun ve içeriğin yeniden dağıtımı, değiştirilmesi ve paylaşılması serbesttir. AI ile üretilen içeriklerin doğruluğu garanti edilmez.

## Güvenlik

Proje, Next.js güvenlik başlıkları ve rate limit altyapısı ile korunmaktadır. API anahtarları ve hassas bilgiler .env dosyasında saklanmalıdır.

## SEO

Her sayfa için zengin meta etiketler, robots.txt ve sitemap.xml dosyaları ile arama motoru optimizasyonu sağlanmıştır. Yapısal veri desteği eklenebilir.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Quick start (local)

1. Install dependencies

   npm install

2. Run development server

   npm run dev

3. Build for production

   npm run build

4. Start production server locally

   npx next start --port 3000


## Environment variables (add to .env.local)

- OPENAI_API_KEY=sk_...
- JWT_SECRET=your_jwt_secret_in_production
- HF_API_TOKEN=hf_... (optional — only if you're enabling Hugging Face reranker)
- HF_ENDPOINT=https://api-inference.huggingface.co/endpoints/<id> (optional — preferred over model-level calls)
- HF_DISABLED=true (set to true to disable Hugging Face calls if your quota/endpoint isn't ready)
- PINECONE_API_KEY and PINECONE_ENV if using Pinecone

Notes:
- DO NOT commit `.env.local` or `mcp.config.json` to source control.
- The project ships with a simple file-based demo user store in `.data/users.json`. Replace with a real DB for production.
- For production, set a strong `JWT_SECRET` and configure persistent storage for users and sessions.

## Hugging Face inference endpoint

The code supports two HF modes:

- Model-level inference (requires the model to be public or your token to have model inference access). This may return 404 for some models.
- Preferred: create an HF Inference Endpoint via the Hugging Face UI and set `HF_ENDPOINT` to its URL; this is more stable and recommended if you want HF reranking.

See `docs/HF_ENDPOINT_SETUP.md` for a short walkthrough.

## Troubleshooting

- If Hugging Face calls fail with 404 or credential errors, set `HF_DISABLED=true` and use OpenAI-only reranking until you can provision an endpoint or fix token permissions.
- If builds fail due to types or linting, run `npm run dev` and fix errors shown in the terminal; the project compiles with TypeScript and Tailwind.
