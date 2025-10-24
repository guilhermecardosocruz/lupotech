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

export default function ProsPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  useEffect(() => { params.then(p => setSlug(p.slug)); }, [params]);

  const title = useMemo(() => slug ? humanize(slug) : "Serviço", [slug]);
  const ranked = useMemo(() => [...DEMO_PROS].sort((a,b) => (b.rating - a.rating) || (a.distanceKm - b.distanceKm)), []);

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px" }}>
      

      <h1 style={{ marginTop: 12, marginBottom: 6 }}>Profissionais disponíveis — {title}</h1>
      <p style={{ color: "var(--muted)" }}>Escolha o profissional para depois selecionar a disponibilidade.</p>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {ranked.map((p, i) => (
          <article key={p.id} className="card" style={{ alignItems: "center", position: "relative" }}>
            <div style={{ position: "absolute", left: 10, top: 10, fontWeight: 700, color: "var(--accent)" }}>{i + 1}</div>
            <div className="icon">👤</div>
            <div style={{ flex: 1 }}>
              <p className="title">{p.name}</p>
              <p className="muted">
                ⭐ {p.rating.toFixed(1)} · {p.jobs} serviços · {p.distanceKm.toFixed(1)} km · a partir de R$ {p.priceFrom}
              </p>
              <p className="muted" style={{ marginTop: 6 }}>
                {p.tags.join(" · ")} · <strong style={{ color: "var(--accent)" }}>{p.available}</strong>
              </p>
            </div>
            <Link href={`/servicos/${slug}/disponibilidade/${p.id}`} className="btn-solid" style={{ borderRadius: 10, padding: "10px 12px" }}>
              Selecionar
            </Link>
          </article>
        ))}
      </section>

      <div style={{ marginTop: 22 }}>
        <Link href="/" className="btn-outline" style={{ borderRadius: 12, padding: "10px 12px" }}>
          ← Voltar
        </Link>
      </div>
    </main>
  );
}
