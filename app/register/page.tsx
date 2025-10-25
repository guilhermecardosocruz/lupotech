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
      localStorage.setItem("auth_user", JSON.stringify(data));
      setMsg("Conta criada com sucesso!");
      window.location.href = "/cliente";
    }catch(err:any){
      setMsg("Erro de rede");
    }finally{ setLoading(false); }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-secondary px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center text-primary">Criar conta</h1>
        <p className="text-sm text-center text-gray-500 mt-2 mb-6">
          Aqui você soluciona o seu problema.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input className="border rounded-lg p-2" placeholder="Nome" required value={name} onChange={e=>setName(e.target.value)} />
          <input className="border rounded-lg p-2" placeholder="E-mail" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="border rounded-lg p-2" placeholder="Senha" type="password" required value={password} onChange={e=>setPassword(e.target.value)} />
          <select className="border rounded-lg p-2" value={role} onChange={e=>setRole(e.target.value as any)}>
            <option value="CLIENTE">Cliente</option>
            <option value="PRESTADOR">Prestador de serviço</option>
          </select>
          <button disabled={loading} className="btn-solid mt-2">{loading ? "Enviando..." : "Cadastrar"}</button>
          {msg && <p className={`text-center text-sm ${msg.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
        </form>
      </div>
    </main>
  );
}
