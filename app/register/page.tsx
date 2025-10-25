"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState<"CLIENTE"|"PRESTADOR">("CLIENTE");
  const [loading,setLoading] = useState(false);
  const [msg,setMsg] = useState<string|null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setLoading(true);
    try{
      const res = await fetch("/api/auth/register",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if(!res.ok){ setMsg(data?.error || "Falha no cadastro"); return; }
      // mantém sessão simples em localStorage (MVP)
      localStorage.setItem("auth_user", JSON.stringify(data));
      setMsg("Conta criada com sucesso!");
      window.location.href = "/cliente"; // redireciona área do cliente
    }catch(err:any){
      setMsg("Erro de rede");
    }finally{ setLoading(false); }
  }

  return (
    <main style={{ maxWidth: 420, margin:"32px auto", padding:"0 16px" }}>
      <h1>Criar conta</h1>
      <p className="muted">Escolha o tipo de conta e informe seus dados.</p>
      <form onSubmit={onSubmit} style={{ display:"grid", gap:12, marginTop:16 }}>
        <label>Nome <input required value={name} onChange={e=>setName(e.target.value)} /></label>
        <label>E-mail <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
        <label>Senha <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>
        <label>Tipo de conta
          <select value={role} onChange={e=>setRole(e.target.value as any)}>
            <option value="CLIENTE">Cliente</option>
            <option value="PRESTADOR">Prestador de serviço</option>
          </select>
        </label>
        <button disabled={loading} className="btn-solid">{loading?"Enviando...":"Cadastrar"}</button>
        {msg && <p style={{ color: msg.includes("sucesso")?"green":"#b91c1c" }}>{msg}</p>}
      </form>
    </main>
  );
}
