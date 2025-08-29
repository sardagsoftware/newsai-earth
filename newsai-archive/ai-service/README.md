# AI service (local)

Bu küçük FastAPI servisi, projede kullanılacak metin gömme (embeddings), rerank (cross-encoder), görüntü gömme (CLIP) ve ses transkripsiyonu (Whisper) endpoint'lerini sağlar.

Önerilen modeller (varsayılanlar):
- Embeddings: `sentence-transformers/all-MiniLM-L6-v2` (küçük, CPU-friendly)
- Rerank: `cross-encoder/ms-marco-MiniLM-L-6-v2` (hızlı, yüksek kaliteli rerank)
- Image (CLIP): `openai/clip-vit-base-patch32`
- Whisper: `openai/whisper-small`

Kurulum

1. Sanal ortam oluşturun ve paketleri kurun:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Servisi çalıştırın:

```bash
uvicorn app:app --host 0.0.0.0 --port 8080
```

Basit test:

```bash
curl -sS -X POST "http://localhost:8080/embed" -H "Content-Type: application/json" -d '{"texts":["merhaba dünya", "iklim değişikliği"]}'
```

Next.js'de entegrasyon

- Yeni environment değişkeni: `AI_SERVICE_URL` (örn. `http://localhost:8080`)
- `src/app/api/search/route.ts` içinde HF çağrısı yerine veya ek olarak `process.env.AI_SERVICE_URL`'e POST yaparak /rerank veya /embed endpoint'lerini kullanabilirsiniz.

Not: GPU kullanmak performansı artırır. Eğer CPU-only ortamdaysanız küçük modeller (`all-MiniLM-L6-v2`, `ms-marco-MiniLM-L-6-v2`) tercih edin.
