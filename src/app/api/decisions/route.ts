import { NextResponse } from "next/server";
// type Decision removed to avoid unused-type lint warning
import { fetchDecisions } from "./fetcher";
import { OpenAI } from "openai";


// OpenAI çeviri fonksiyonu
async function translateOpenAI(text: string, targetLang: string): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Aşağıdaki metni ${targetLang} diline çevir: ${text}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 512
  });
  return completion.choices[0]?.message?.content || text;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const ministry = searchParams.get("ministry");
  const type = searchParams.get("type");
  const lang = searchParams.get("lang") || "tr";

  // Otomatik veri çekme
  let decisions = await fetchDecisions();
  if (country) decisions = decisions.filter(d => d.country === country);
  if (ministry) decisions = decisions.filter(d => d.ministry === ministry);
  if (type) decisions = decisions.filter(d => d.type === type);

  // Gerçek çeviri API ile çeviri
  const translated = await Promise.all(decisions.map(async d => {
    if (d.language !== lang) {
      return {
        ...d,
        subject: await translateOpenAI(d.subject, lang),
        description: await translateOpenAI(d.description, lang),
        language: lang
      };
    }
    return d;
  }));

  return NextResponse.json({ decisions: translated });
}
