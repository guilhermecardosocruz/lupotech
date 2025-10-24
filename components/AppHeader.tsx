"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = { id: string; name?: string; role?: "CLIENTE" | "PRESTADOR" } | null;

export default function AppHeader(){
  const [user, setUser] = useState<User>(null);

  // Lê sessão e reage a mudanças (login/logout em outras abas ou na mesma)
  function readSession(){
    try {
      const raw = localStorage.getItem("auth_user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch { setUser(null); }
  }

  useEffect(() => {
    readSession();
    const onStorage = (e: StorageEvent) => { if (e.key === "auth_user") readSession(); };
    const onCustom  = () => readSession(); // "auth:update" custom
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:update", onCustom as any);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:update", onCustom as any);
    };
  }, []);

  return (
    <header className="header">
      <div className="brand">
        <span className="brand-badge">S</span>
        <span>Serviços</span>
      </div>

      {/* Menu varia conforme sessão */}
      {!user && (
        <nav className="auth-actions">
          <Link className="btn-outline" href="/login">Entrar</Link>
          <Link className="btn-solid" href="/register">Cadastrar</Link>
        </nav>
      )}

      {user?.role === "CLIENTE" && (
        <nav className="auth-actions">
          <Link className="btn-outline" href="/cliente/servicos">Serviços realizados</Link>
          <Link className="btn-solid" href="/logout">Sair</Link>
        </nav>
      )}

      {user?.role === "PRESTADOR" && (
        <nav className="auth-actions">
          <Link className="btn-outline" href="/prestador/onboarding">Completar perfil</Link>
          <Link className="btn-solid" href="/logout">Sair</Link>
        </nav>
      )}
    </header>
  );
}
