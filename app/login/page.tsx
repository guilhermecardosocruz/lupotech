"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

type Role = "CLIENTE" | "PRESTADOR";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("CLIENTE");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const r = await fetch("/api/auth/me", { cache: "no-store" });
        if (r.ok && !off) {
          const j = await r.json().catch(() => null);
          const go = j?.user?.role === "PRESTADOR" ? "/prestador" : "/cliente";
          if (j?.user) router.replace(go);
        }
      } catch {}
    })();
    return () => { off = true; };
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(data?.error || "Falha no login"); return; }
      router.replace(role === "PRESTADOR" ? "/prestador" : "/cliente");
    } catch {
      setErr("Erro de rede");
    } finally {
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
