"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Role = "CLIENTE" | "PRESTADOR";
type User = { id: string; name?: string | null; email: string; role: Role } | null;

export default function AppHeader() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe(signal?: AbortSignal) {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store", signal });
      if (!res.ok) { setUser(null); return; }
      const data = await res.json().catch(() => null);
      setUser(data?.user ?? null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const ctrl = new AbortController();
    fetchMe(ctrl.signal);

    const onFocus = () => fetchMe();
    const onVis = () => { if (document.visibilityState === "visible") fetchMe(); };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      ctrl.abort();
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <header className="header">
      <div className="brand">
        <span className="brand-badge">S</span>
        <span>Serviços</span>
      </div>

      {!loading && !user && (
        <nav className="auth-actions">
          <Link className="btn-outline" href="/login">Entrar</Link>
          <Link className="btn-solid" href="/register">Cadastrar</Link>
        </nav>
      )}

      {!loading && user?.role === "CLIENTE" && (
        <nav className="auth-actions">
          <Link className="btn-outline" href="/cliente/servicos">Serviços realizados</Link>
          <Link className="btn-solid" href="/logout">Sair</Link>
        </nav>
      )}

      {!loading && user?.role === "PRESTADOR" && (
        <nav className="auth-actions">
          <Link className="btn-outline" href="/prestador/onboarding">Completar perfil</Link>
          <Link className="btn-solid" href="/logout">Sair</Link>
        </nav>
      )}
    </header>
  );
}
