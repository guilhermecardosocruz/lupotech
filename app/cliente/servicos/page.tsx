"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Done = { id: string; categoria: string; pro: string; data: string; valor: number; status: "CONCLUIDO" | "CANCELADO" };
function money(n: number){ return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}); }

export default function HistoricoCliente(){
  useEffect(()=>{ try{ if(!JSON.parse(localStorage.getItem("auth_user")||"null")) location.replace("/login"); }catch{} }, []);
  const [items, setItems] = useState<Done[]>([]);
  useEffect(()=>{ try{
    const raw=localStorage.getItem("cliente_history");
    if(raw) setItems(JSON.parse(raw));
    else {
      const seed: Done[]=[
        {id:"o1",categoria:"Eletricista",pro:"João Silva",data:new Date(Date.now()-86400000*7).toISOString(),valor:120,status:"CONCLUIDO"},
        {id:"o2",categoria:"Limpeza",pro:"Maria Souza",data:new Date(Date.now()-86400000*30).toISOString(),valor:180,status:"CONCLUIDO"}
      ];
      localStorage.setItem("cliente_history", JSON.stringify(seed));
      setItems(seed);
    }
  }catch{} },[]);

  return (
    <main style={{ maxWidth: 980, margin:"0 auto", padding:24 }}>
      <h1 style={{ marginTop: 8, marginBottom: 6 }}>Serviços realizados</h1>
      <p className="muted">Seu histórico de atendimentos.</p>

      {items.length===0 ? (
        <p className="muted" style={{ marginTop: 16 }}>Você ainda não tem serviços realizados.</p>
      ) : (
        <section style={{ display:"grid", gap:10, marginTop: 16 }}>
          {items.map((it)=>(
            <article key={it.id} className="card" style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:8 }}>
              <div>
                <p className="title" style={{ marginBottom: 4 }}>{it.categoria} · {it.pro}</p>
                <p className="muted" style={{ margin: 0 }}>
                  {new Date(it.data).toLocaleString("pt-BR")} · {it.status==="CONCLUIDO"?"Concluído":"Cancelado"}
                </p>
              </div>
              <div style={{ alignSelf:"center", fontWeight:700 }}>{money(it.valor)}</div>
            </article>
          ))}
        </section>
      )}

      <div style={{ marginTop: 18 }}>
        <Link href="/cliente" className="btn-outline" style={{ borderRadius:12, padding:"10px 12px" }}>← Voltar</Link>
      </div>
    </main>
  );
}
