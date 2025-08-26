import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let q = "";
  let formData: FormData | null = null;
    if (contentType.includes("multipart/form-data")) {
  formData = await req.formData();
  const qv = formData.get("q");
  q = typeof qv === "string" ? qv : "";
    } else {
      const body = await req.json();
      q = body.q || "";
    }

    const modules = ["/api/newsai", "/api/climateai", "/api/agricultureai", "/api/chemistryai", "/api/biologyai", "/api/elementsai", "/api/historyai", "/api/decisions"];

    const fetches = modules.map(async (m) => {
      try {
        // If multipart, forward the form data to the first module that accepts files.
        if (formData && (m === "/api/newsai" || m === "/api/decisions")) {
          const fd = new FormData();
          fd.append("q", q);
          for (const f of formData.getAll("images")) fd.append("images", f as unknown as Blob);
          for (const f of formData.getAll("files")) fd.append("files", f as unknown as Blob);
          const r = await fetch(m, { method: "POST", body: fd });
          return await r.json();
        }

        const r = await fetch(`${m}?q=${encodeURIComponent(q)}`);
        return await r.json();
      } catch (e) {
        return { error: String(e), source: m };
      }
    });


    const settled = await Promise.all(fetches);

    // Flatten and tag results
    const results = settled.flatMap((s: unknown) => {
  const x = s as unknown as Record<string, unknown>;
      if (x && Array.isArray(x.articles)) return x.articles;
      if (Array.isArray(x)) return x;
      return [x];
    });

    return new Response(JSON.stringify({ results }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
