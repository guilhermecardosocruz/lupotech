"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Pro = {
  id: string; name: string; rating: number; jobs: number; distanceKm: number; priceFrom: number; tags: string[]; available: string;
};

const DEMO_PROS: Pro[] = [
  { id: "p1", name: "João Silva", rating: 4.9, jobs: 312, distanceKm: 2.1, priceFrom: 80, tags: ["Rápido", "Garantia 90 dias"], available: "Hoje 14:00–18:00" },
  { id: "p2", name: "Maria Souza", rating: 4.8, jobs: 211, distanceKm: 3.7, priceFrom: 70, tags: ["Orçamento no local"], available: "Hoje 16:00–20:00" },
  { id: "p3", name: "Oficina Center", rating: 4.7, jobs: 529, distanceKm: 5.4, priceFrom: 65, tags: ["Empresa", "Nota fiscal"], available: "Amanhã 08:00–12:00" },
  { id: "p4", name: "Rafael Tech", rating: 4.6, jobs: 146, distanceKm: 1.9, priceFrom: 60, tags: ["PIX/Cartão"], available: "Hoje 18:00–21:00" },
];

function humanize(slug: string){
  return slug.split("-").map(s => s ? s[0].toUpperCase() + s.slice(1) : s).join(" ");
}

export default function ConfirmPage({ params }: { params: Promise<{ slug: string; proId: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [proId, setProId] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  useEffect(() => {
    params.then(p => { setSlug(p.slug); setProId(p.proId); });
    try{
      const raw = sessionStorage.getItem("draft_request");
      if (raw) setDesc(JSON.parse(raw)?.description || "");
    }catch{}
  }, [params]);

  const name = useMemo(() => humanize(slug || "servico"), [slug]);
  const pro = useMemo(() => DEMO_PROS.find(x => x.id === proId), [proId]);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
      

      <h1 style={{ marginTop: 12, marginBottom: 8 }}>Confirmar solicitação — {name}</h1>
      {pro ? (
        <section style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 16, background: "#fff" }}>
          <p style={{ margin: 0 }}><strong>Profissional:</strong> {pro.name} · ⭐ {pro.rating.toFixed(1)} · {pro.jobs} serviços · {pro.distanceKm.toFixed(1)} km</p>
          <p className="muted" style={{ marginTop: 6 }}>Disponibilidade: <strong style={{ color: "var(--accent)" }}>{pro.available}</strong> · A partir de R$ {pro.priceFrom}</p>
          {desc && <p style={{ marginTop: 12 }}><strong>Seu pedido:</strong> {desc}</p>}
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button
              className="btn-solid"
              style={{ borderRadius: 12, padding: "12px 14px" }}
              onClick={() => alert("Fluxo de agendamento simulado! (próximo passo: agenda + pagamento)")}
            >
              Confirmar agendamento
            </button>
            <Link href={`/servicos/${slug}/profissionais`} className="btn-outline" style={{ borderRadius: 12, padding: "12px 14px" }}>
              Trocar profissional
            </Link>
          </div>
        </section>
      ) : (
        <p className="muted">Profissional não encontrado.</p>
      )}

      <div style={{ marginTop: 22 }}>
        <Link href={`/servicos/${slug}`} className="btn-outline" style={{ borderRadius: 12, padding: "10px 12px", display: "inline-block" }}>
          ← Voltar
        </Link>
      </div>
    </main>
  );
}
