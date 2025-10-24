"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

type Role = "CLIENTE" | "PRESTADOR";

export default function RegisterPage(){
  const router = useRouter();
  const [role, setRole] = useState<Role>("CLIENTE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    try{
      const u = JSON.parse(localStorage.getItem("auth_user") || "null");
      if (u?.role) router.replace(u.role === "PRESTADOR" ? "/prestador" : "/cliente");
    }catch{}
  }, [router]);

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    setErr(null);
    if (!name || !email || !password) { setErr("Preencha nome, e-mail e senha."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErr("E-mail inválido."); return; }
    if (password.length < 6) { setErr("Senha deve ter pelo menos 6 caracteres."); return; }
    setLoading(true);

    const user = { id: crypto.randomUUID(), name, email, phone, role, createdAt: Date.now() };
    try {
      const db = JSON.parse(localStorage.getItem("users_db") || "[]");
      if (db.some((u: any) => u.email === email && u.role === role)) {
        setErr("E-mail já cadastrado para esse tipo de conta."); setLoading(false); return;
      }
      db.push({ ...user, password });
      localStorage.setItem("users_db", JSON.stringify(db));
      localStorage.setItem("auth_user", JSON.stringify(user));
      try{ window.dispatchEvent(new Event("auth:update")); }catch{}
    } catch {}
    router.push(role === "PRESTADOR" ? "/prestador/onboarding" : "/cliente");
  }

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 24 }}>
      

      <h1 style={{ marginTop: 12, marginBottom: 6 }}>Criar conta</h1>
      <p className="muted" style={{ marginTop: 0 }}>Escolha seu tipo de conta e preencha seus dados.</p>

      <form onSubmit={onSubmit} style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 16, background: "#fff" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <button type="button" className="btn-outline"
            style={{ borderRadius: 10, padding: "10px 12px", borderColor: role==="CLIENTE" ? "var(--accent)" : undefined }}
            onClick={() => setRole("CLIENTE")}>Sou Cliente</button>
          <button type="button" className="btn-outline"
            style={{ borderRadius: 10, padding: "10px 12px", borderColor: role==="PRESTADOR" ? "var(--accent)" : undefined }}
            onClick={() => setRole("PRESTADOR")}>Sou Prestador</button>
        </div>

        <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Nome</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Seu nome completo"
          style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:12, padding:12, marginBottom:10 }} />

        <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>E-mail</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="voce@email.com" type="email"
          style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:12, padding:12, marginBottom:10 }} />

        <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Telefone (WhatsApp)</label>
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="(XX) 90000-0000"
          style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:12, padding:12, marginBottom:10 }} />

        <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Senha</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" type="password"
          style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:12, padding:12 }} />

        {err && <p style={{ color: "#b91c1c", marginTop: 8 }}>{err}</p>}

        <div style={{ marginTop: 14, display:"flex", gap:10 }}>
          <button disabled={loading} className="btn-solid" style={{ borderRadius:12, padding:"12px 14px" }}>
            {loading ? "Criando..." : "Criar conta"}
          </button>
          <Link href="/" className="btn-outline" style={{ borderRadius:12, padding:"12px 14px" }}>Cancelar</Link>
        </div>
      </form>
    </main>
  );
}
