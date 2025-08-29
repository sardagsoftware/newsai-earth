from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List
import os

app = FastAPI(title="newsai - ai service")

class TextsIn(BaseModel):
    texts: List[str]

class RerankIn(BaseModel):
    query: str
    candidates: List[str]

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/embed")
async def embed(body: TextsIn):
    try:
        from sentence_transformers import SentenceTransformer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Missing dependency: {e}")
    model_name = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    model = SentenceTransformer(model_name)
    embs = model.encode(body.texts, convert_to_numpy=True).tolist()
    return {"embeddings": embs}

@app.post("/rerank")
async def rerank(body: RerankIn):
    try:
        from sentence_transformers import CrossEncoder
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Missing dependency: {e}")
    model_name = os.getenv("RERANK_MODEL", "cross-encoder/ms-marco-MiniLM-L-6-v2")
    model = CrossEncoder(model_name)
    pairs = [[body.query, c] for c in body.candidates]
    scores = model.predict(pairs).tolist()
    return {"scores": scores}

@app.post("/image-embed")
async def image_embed(file: UploadFile = File(...)):
    try:
        from PIL import Image
        import io
        from sentence_transformers import SentenceTransformer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Missing dependency: {e}")
    model_name = os.getenv("CLIP_MODEL", "openai/clip-vit-base-patch32")
    content = await file.read()
    img = Image.open(io.BytesIO(content)).convert("RGB")
    model = SentenceTransformer(model_name)
    emb = model.encode(img, convert_to_numpy=True).tolist()
    return {"embedding": emb}

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        import whisper
        import io
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Missing dependency: {e}")
    model_name = os.getenv("WHISPER_MODEL", "small")
    content = await file.read()
    # write to temp file
    import tempfile
    tf = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tf.write(content)
    tf.flush()
    tf.close()
    model = whisper.load_model(model_name)
    result = model.transcribe(tf.name)
    return {"text": result.get("text", "")}
