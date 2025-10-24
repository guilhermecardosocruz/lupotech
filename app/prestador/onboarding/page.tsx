"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OnboardingPrestador(){
  useEffect(() => {
    try{
      const u = JSON.parse(localStorage.getItem("auth_user") || "null");
      if (!u) window.location.replace("/login");
      else if (u.role !== "PRESTADOR") window.location.replace("/cliente");
    }catch{}
  }, []);

  const [bio, setBio] = useState(""); const [radius, setRadius] = useState(10); const [cats, setCats] = useState<string[]>([]);
  function toggleCat(c: string){ setCats(prev => prev.includes(c) ? prev.filter(x=>x!==c) : [...prev, c]); }
  function save(){
    try{
      const u = JSON.parse(localStorage.getItem("auth_user") || "null");
      const k = `provider_${u?.id || "anon"}`;
      localStorage.setItem(k, JSON.stringify({ bio, radius, cats }));
      alert("Perfil salvo (simulado).");
    }catch{}
  }
  const CATS = ["Eletricista","Encanador","Autoelétrica","Ar-condicionado","Informática","Limpeza"];

  return (
    <main style={{ maxWidth: 900, margin:"0 auto", padding:24 }}>
      

      <h1 style={{ marginTop:12, marginBottom:8 }}>Completar perfil do prestador</h1>
      <section style={{ border:"1px solid #e5e7eb", borderRadius:16, padding:16, background:"#fff" }}>
        <label style={{ display:"block", fontWeight:600, marginBottom:6 }}>Biografia curta</label>
        <textarea rows={4} value={bio} onChange={(e)=>setBio(e.target.value)}
          placeholder="Fale sobre sua experiência, certificações e equipamentos."
          style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:12, padding:12 }} />

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:12 }}>
          <div>
            <label style={{ display:"block", fontWeight:600, marginBottom:6 }}>Raio de atendimento (km)</label>
            <input type="number" min={1} max={100} value={radius} onChange={(e)=>setRadius(Number(e.target.value))}
              style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:12, padding:12 }} />
          </div>
          <div>
            <label style={{ display:"block", fontWeight:600, marginBottom:6 }}>Categorias</label>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {CATS.map(c => (
                <button key={c} type="button"
                  className="btn-outline"
                  style={{ borderRadius:8, padding:"8px 10px", borderColor: cats.includes(c) ? "var(--accent)" : undefined }}
                  onClick={()=>toggleCat(c)}
                >{c}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:14 }}>
          <button className="btn-solid" style={{ borderRadius:12, padding:"12px 14px" }} onClick={save}>Salvar</button>
        </div>
      </section>
    </main>
  );
}
