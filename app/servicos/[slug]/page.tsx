"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function humanize(slug: string){
  return slug.split("-").map(s => s ? s[0].toUpperCase() + s.slice(1) : s).join(" ");
}

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [desc, setDesc] = useState("");
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  const name = useMemo(() => (slug ? humanize(slug) : "Serviço"), [slug]);

  function onContinue(){
    try{
      const payload = { slug, description: desc, ts: Date.now() };
      sessionStorage.setItem("draft_request", JSON.stringify(payload));
    }catch{}
    router.push(`/servicos/${slug}/profissionais`);
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
      

      <h1 style={{ marginTop: 12, marginBottom: 8 }}>{name}</h1>
      <p style={{ color: "var(--muted)", margin: 0, maxWidth: 720 }}>
        Descreva seu problema, anexe fotos e informe endereço/horário. Você receberá propostas de profissionais próximos.
      </p>

      <section style={{ marginTop: 20, border: "1px solid #e5e7eb", borderRadius: 16, padding: 16, background: "#fff" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Descreva o serviço</label>
        <textarea
          placeholder={`Ex.: Preciso de ${name.toLowerCase()} amanhã à tarde...`}
          rows={5}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={{ width: "100%", resize: "vertical", borderRadius: 12, border: "1px solid #e5e7eb", padding: 12, outline: "none" }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button className="btn-outline" style={{ borderRadius: 12, padding: "12px 14px" }} disabled>Anexar fotos (em breve)</button>
          <button className="btn-solid" style={{ borderRadius: 12, padding: "12px 14px" }} onClick={onContinue}>Continuar</button>
        </div>
      </section>

      <p style={{ color: "var(--muted)", marginTop: 12, fontSize: 13 }}>
        Dica: quanto mais detalhes, mais precisa será a proposta (marca/modelo, medidas, horário preferido).
      </p>

      <div style={{ marginTop: 28 }}>
        <Link href="/" className="btn-outline" style={{ borderRadius: 12, padding: "10px 12px", display: "inline-block" }}>
          ← Voltar
        </Link>
      </div>
    </main>
  );
}
