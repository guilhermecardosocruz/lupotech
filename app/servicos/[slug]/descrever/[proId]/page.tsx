"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function humanize(slug: string){
  return slug.split("-").map(s => s ? s[0].toUpperCase() + s.slice(1) : s).join(" ");
}

export default function DescribePage({ params }: { params: Promise<{ slug: string; proId: string }> }) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [proId, setProId] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => { setSlug(p.slug); setProId(p.proId); });
    try{
      const raw = sessionStorage.getItem("draft_request");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.description) setDesc(parsed.description);
        if (parsed?.date) setDate(parsed.date);
        if (parsed?.time) setTime(parsed.time);
      }
    }catch{}
  }, [params]);

  const name = useMemo(() => humanize(slug || "serviço"), [slug]);

  function onContinue(){
    const prev = JSON.parse(sessionStorage.getItem("draft_request") || "{}");
    const payload = { ...prev, slug, proId, description: desc, date, time, ts: Date.now() };
    try{ sessionStorage.setItem("draft_request", JSON.stringify(payload)); }catch{}
    router.push(`/servicos/${slug}/agendar/${proId}`);
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      

      <h1 style={{ marginTop: 12, marginBottom: 8 }}>Descreva seu serviço — {name}</h1>
      {(date || time) && (
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          <strong>Atendimento:</strong> {date ?? "—"} às {time ?? "—"} ·{" "}
          <Link href={`/servicos/${slug}/disponibilidade/${proId}`} className="btn-outline" style={{ borderRadius: 8, padding: "4px 8px", marginLeft: 6 }}>
            alterar
          </Link>
        </p>
      )}

      <section style={{ marginTop: 16, border: "1px solid #e5e7eb", borderRadius: 16, padding: 16, background: "#fff" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Descrição</label>
        <textarea
          placeholder={`Ex.: Detalhes do serviço de ${name.toLowerCase()}...`}
          rows={6}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={{ width: "100%", resize: "vertical", borderRadius: 12, border: "1px solid #e5e7eb", padding: 12 }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button className="btn-solid" style={{ borderRadius: 12, padding: "12px 14px" }} onClick={onContinue}>
            Continuar
          </button>
          <Link href={`/servicos/${slug}/disponibilidade/${proId}`} className="btn-outline" style={{ borderRadius: 12, padding: "12px 14px" }}>
            ← Voltar para disponibilidade
          </Link>
        </div>
      </section>
    </main>
  );
}
