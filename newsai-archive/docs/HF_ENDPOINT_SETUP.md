# Hugging Face Inference Endpoint setup for DeepSeek

Bu rehber, `deepseek-ai/DeepSeek-V3.1-Base` modelini Hugging Face Inference Endpoint olarak deploy edip `HF_ENDPOINT` ortam değişkeni olarak projenizde kullanmanızı sağlar.

Özet adımlar

1. Hugging Face hesabınıza giriş yapın.
2. Model sayfasına gidin: https://huggingface.co/deepseek-ai/DeepSeek-V3.1-Base
3. "Deploy" veya "Create Endpoint" (Inference Endpoints) seçeneğini bulun.
4. Endpoint'i oluşturun:
   - Model: `deepseek-ai/DeepSeek-V3.1-Base`
   - Hardware: uygun GPU (ör. `g4dn.xlarge`)
   - Name: örn. `newsai-deepseek`
5. Endpoint oluşturulduğunda size bir endpoint URL verilecektir, örn:
   `https://api-inference.huggingface.co/endpoints/<your-endpoint-id>`
6. Bu URL'i projenizde `.env.local` içinde `HF_ENDPOINT` olarak ayarlayın:

```
HF_ENDPOINT=https://api-inference.huggingface.co/endpoints/<your-endpoint-id>
```

7. Ayrıca `HF_API_TOKEN` ortam değişkeninde tokenınızın bulunduğundan emin olun.

Test

Oluşturduktan sonra project kökünde `npm run build` ve sonra lokal prod server çalıştırdıktan sonra şu POST isteği ile endpoint'i test edebilirsiniz:

```bash
curl -X POST "$HF_ENDPOINT" \
  -H "Authorization: Bearer $HF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"query":"iklim değişikliği etkileri","candidates":["AI iklim tahminlerini geliştiriyor","Tarımda AI kullanımı artıyor"]}}'
```

Notlar
- Endpoint oluşturma hesabınızın faturalama/limit ayarlarına bağlı olarak ücretlendirme başlatabilir.
- Eğer model-level `https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-V3.1-Base` çalışmıyorsa `HF_ENDPOINT` kullanmak genelde çözüm olur.
- Güvenlik: `mcp.config.json` ve `.env.local` gibi dosyaları repoya commit etmeyin. `.gitignore`a ekledim.
