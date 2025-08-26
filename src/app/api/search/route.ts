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

    const modules = [
      { path: "/api/newsai", name: "Haber & AI" },
      { path: "/api/climateai", name: "İklim & AI" },
      { path: "/api/agricultureai", name: "Tarım & AI" },
      { path: "/api/chemistryai", name: "Kimya & AI" },
      { path: "/api/biologyai", name: "Biyoloji & AI" },
      { path: "/api/elementsai", name: "Element & Bilim" },
      { path: "/api/historyai", name: "Tarih & AI" },
      { path: "/api/decisions", name: "Bakanlık Kararları" },
    ];

    const fetches = modules.map(async (m) => {
      try {
        // If multipart, forward the form data to the first module that accepts files.
        if (formData && (m.path === "/api/newsai" || m.path === "/api/decisions")) {
          const fd = new FormData();
          fd.append("q", q);
          for (const f of formData.getAll("images")) fd.append("images", f as unknown as Blob);
          for (const f of formData.getAll("files")) fd.append("files", f as unknown as Blob);
          const r = await fetch(m.path, { method: "POST", body: fd });
          const json = await r.json();
          return { module: m.name, payload: json };
        }

        const r = await fetch(`${m.path}?q=${encodeURIComponent(q)}`);
        const json = await r.json();
        return { module: m.name, payload: json };
      } catch (e) {
        return { error: String(e), source: m.path };
      }
    });


    const settled = await Promise.all(fetches);

    // Flatten, tag with source, dedupe and limit
    const rawResults: unknown[] = [];
    for (const entry of settled) {
      const e = entry as unknown as { module?: string; payload?: unknown };
      const moduleName = e.module ?? "Unknown";
      const p = e.payload ?? e;
      if (p && typeof p === "object") {
        const obj = p as Record<string, unknown>;
        if (Array.isArray(obj.articles)) {
          for (const a of obj.articles) rawResults.push({ ...(a as Record<string, unknown>), source: moduleName });
        } else if (Array.isArray(p)) {
          for (const a of (p as unknown[])) rawResults.push({ ...(a as Record<string, unknown>), source: moduleName });
        } else {
          rawResults.push({ ...(obj as Record<string, unknown>), source: moduleName });
        }
      } else {
        rawResults.push({ value: p, source: moduleName });
      }
    }

    // Deduplicate by id/url/title fallback
    const seen = new Set<string>();
    const results: unknown[] = [];
    for (const item of rawResults) {
      const it = item as Record<string, unknown>;
      const key = (typeof it.id === "string" && it.id) || (typeof it.url === "string" && it.url) || (typeof it.title === "string" && it.title) || JSON.stringify(it);
      if (!key) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      results.push(it);
      if (results.length >= 30) break; // limit
    }

    return new Response(JSON.stringify({ results }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
