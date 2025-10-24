"use client";

import Link from "next/link";

export default function LogoutConfirm(){
  async function doLogout(){
    try { localStorage.removeItem("auth_user"); try{ window.dispatchEvent(new Event("auth:update")); }catch{} } catch {}
    window.location.replace("/");
  }
  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 24 }}>
      

      <h1 style={{ marginTop: 12, marginBottom: 8 }}>Sair da conta?</h1>
      <p className="muted">Você permanecerá conectado até confirmar a saída.</p>

      <section style={{ marginTop: 16, border: "1px solid #e5e7eb", borderRadius: 16, padding: 16, background: "#fff" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-solid" style={{ borderRadius: 12, padding: "12px 14px" }} onClick={doLogout}>
            Confirmar sair
          </button>
          <Link href="/cliente" className="btn-outline" style={{ borderRadius: 12, padding: "12px 14px" }}>
            Cancelar
          </Link>
        </div>
      </section>
    </main>
  );
}
