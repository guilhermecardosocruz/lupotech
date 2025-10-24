"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function humanize(slug: string){
  return slug.split("-").map(s => s ? s[0].toUpperCase() + s.slice(1) : s).join(" ");
}

function todayISO(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

const QUICK_SLOTS = ["08:00","10:00","14:00","16:00","18:00","20:00"];

export default function AvailabilityPage({ params }: { params: Promise<{ slug: string; proId: string }> }) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [proId, setProId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("14:00");

  useEffect(() => {
    params.then(p => { setSlug(p.slug); setProId(p.proId); });
    try {
      const raw = sessionStorage.getItem("draft_request");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.date) setDate(parsed.date);
        if (parsed?.time) setTime(parsed.time);
      }
    } catch {}
  }, [params]);

  const name = useMemo(() => humanize(slug || "serviço"), [slug]);

  function onContinue(){
    try{
      const prev = JSON.parse(sessionStorage.getItem("draft_request") || "{}");
      const payload = { ...prev, slug, proId, date, time, ts: Date.now() };
      sessionStorage.setItem("draft_request", JSON.stringify(payload));
    }catch{
      const fallback = { slug, proId, date, time, ts: Date.now() };
      sessionStorage.setItem("draft_request", JSON.stringify(fallback));
    }
    router.push(`/servicos/${slug}/descrever/${proId}`);
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      

      <h1 style={{ marginTop: 12, marginBottom: 8 }}>Escolha data e hora — {name}</h1>
      <p style={{ color: "var(--muted)", maxWidth: 720 }}>
        Selecione a melhor data e horário para o atendimento do profissional escolhido.
      </p>

      <section style={{ marginTop: 20, border: "1px solid #e5e7eb", borderRadius: 16, padding: 16, background: "#fff" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", borderRadius: 12, border: "1px solid #e5e7eb", padding: 12 }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Horário</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ width: "100%", borderRadius: 12, border: "1px solid #e5e7eb", padding: 12, background: "#fff" }}
            >
              {QUICK_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {QUICK_SLOTS.map(t => (
                <button
                  key={t}
                  type="button"
                  className="btn-outline"
                  style={{ borderRadius: 10, padding: "8px 10px", borderColor: time === t ? "var(--accent)" : undefined }}
                  onClick={() => setTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button className="btn-solid" style={{ borderRadius: 12, padding: "12px 14px" }} onClick={onContinue}>
            Continuar
          </button>
          <Link href={`/servicos/${slug}/profissionais`} className="btn-outline" style={{ borderRadius: 12, padding: "12px 14px" }}>
            ← Trocar profissional
          </Link>
        </div>
      </section>
    </main>
  );
}
