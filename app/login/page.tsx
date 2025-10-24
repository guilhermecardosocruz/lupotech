"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

type Role = "CLIENTE" | "PRESTADOR";

export default function LoginPage(){
  const router = useRouter();
  const [role, setRole] = useState<Role>("CLIENTE");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try{
      const u = JSON.parse(localStorage.getItem("auth_user") || "null");
      if (u?.role) router.replace(u.role === "PRESTADOR" ? "/prestador" : "/cliente");
    }catch{}
  }, [router]);

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try{
      const db = JSON.parse(localStorage.getItem("users_db") || "[]");
      const found = db.find((u: any) => u.email === email && u.password === password && u.role === role);
      if (!found) { setErr("Credenciais inválidas ou tipo de conta incorreto."); setLoading(false); return; }
      const { password: _omit, ...user } = found;
      localStorage.setItem("auth_user", JSON.stringify(user));
      try{ window.dispatchEvent(new Event("auth:update")); }catch{}
      router.push(role === "PRESTADOR" ? "/prestador" : "/cliente");
    }catch{
      setErr("Não foi possível autenticar.");
    }finally{
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 24 }}>
      

      <h1 style={{ marginTop: 12, marginBottom: 6 }}>Entrar</h1>
      <p className="muted" style={{ marginTop: 0 }}>Selecione o tipo de conta e informe suas credenciais.</p>

      <form onSubmit={onSubmit} style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 16, background: "#fff" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <button type="button" className="btn-outline"
            style={{ borderRadius: 10, padding: "10px 12px", borderColor: role==="CLIENTE" ? "var(--accent)" : undefined }}
            onClick={() => setRole("CLIENTE")}>Cliente</button>
          <button type="button" className="btn-outline"
            style={{ borderRadius: 10, padding: "10px 12px", borderColor: role==="PRESTADOR" ? "var(--accent)" : undefined }}
            onClick={() => setRole("PRESTADOR")}>Prestador</button>
        </div>

        <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>E-mail</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="voce@email.com"
          style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:12, padding:12, marginBottom:10 }} />

        <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Senha</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="••••••••"
          style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:12, padding:12 }} />

        {err && <p style={{ color: "#b91c1c", marginTop: 8 }}>{err}</p>}

        <div style={{ marginTop: 14, display:"flex", gap:10 }}>
          <button disabled={loading} className="btn-solid" style={{ borderRadius:12, padding:"12px 14px" }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <Link href="/" className="btn-outline" style={{ borderRadius:12, padding:"12px 14px" }}>Cancelar</Link>
        </div>
      </form>
    </main>
  );
}
