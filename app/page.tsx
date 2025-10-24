"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Service = { name: string; emoji: string; hint: string; slug: string };

const BASE_SERVICES = [
  ["Eletricista","⚡","Instalações, disjuntores, tomadas"],
  ["Encanador","🚰","Vazamentos, torneiras, ralos"],
  ["Limpeza","🧹","Residencial e comercial"],
  ["Mecânico","🔧","Carro, moto e revisões"],
  ["Pintura","🎨","Paredes internas/externas"],
  ["Montador de móveis","🪑","Guarda-roupas, racks, prateleiras"],
  ["Ar-condicionado","❄️","Instalação e manutenção"],
  ["Refrigeração","🧊","Geladeira, freezer, autorizadas"],
  ["Gesseiro","🧱","Drywall e forros"],
  ["Pedreiro","🏗️","Alvenaria e reformas"],
  ["Serralheiro","🪚","Esquadrias e portões"],
  ["Eletrônica","📺","TV, som, micro-ondas"],
  ["Informática","💻","Formatação, rede, impressão"],
  ["Jardinagem","🌿","Podas e manutenção"],
  ["Dedetização","🐜","Controle de pragas"],
  ["Chaveiro","🔑","Aberturas e cópias"],
  ["Vidraceiro","🪟","Box, janelas e portas"],
  ["Telhados","🏠","Goteiras e substituições"],
  ["CFTV/Segurança","📹","Instalação de câmeras e alarmes"],
  ["Autoelétrica","🔋","Baterias, alternadores e parte elétrica automotiva"],
] as const;

function toSlug(s: string){
  return s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}

export default function HomePage(){
  const [q, setQ] = useState("");
  const services = useMemo<Service[]>(
    () => BASE_SERVICES.map(([name, emoji, hint]) => ({ name, emoji, hint, slug: toSlug(name) })), []
  );
  const filtered = useMemo(
    () => services.filter(s => s.name.toLowerCase().includes(q.toLowerCase())), [services, q]
  );

  return (
    <main>
      <section className="hero" style={{ marginTop: 8 }}>
        <h1>Aqui você soluciona o seu problema</h1>
        <p>Escolha a categoria e encontre profissionais próximos com ótimas avaliações.</p>

        <div className="search-card" role="search">
          <input className="search-input" placeholder="O que você precisa? ex.: eletricista"
                 value={q} onChange={(e)=>setQ(e.target.value)} />
          <button className="search-btn" onClick={()=>{
            const best = filtered[0] ?? services[0];
            window.location.assign(`/servicos/${best.slug}/profissionais`);
          }}>Encontrar</button>
        </div>
      </section>

      <section className="grid" aria-label="Categorias de serviços">
        {(q ? filtered : services).map(s => (
          <Link key={s.slug} href={`/servicos/${s.slug}/profissionais`} className="card">
            <span className="icon">{s.emoji}</span>
            <div><p className="title">{s.name}</p><p className="muted">{s.hint}</p></div>
          </Link>
        ))}
      </section>

      <footer className="footer">© {new Date().getFullYear()} Serviços App.</footer>
    </main>
  );
}
