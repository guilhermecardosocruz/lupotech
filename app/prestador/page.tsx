"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PrestadorHome(){
  useEffect(() => {
    try{
      const u = JSON.parse(localStorage.getItem("auth_user") || "null");
      if (!u) window.location.replace("/login");
      else if (u.role !== "PRESTADOR") window.location.replace("/cliente");
    }catch{}
  }, []);

  return (
    <main style={{ maxWidth: 980, margin:"0 auto", padding:24 }}>
      
      <h1 style={{ marginTop: 12 }}>Área do prestador</h1>
      <p className="muted">Complete seu perfil e defina sua disponibilidade.</p>
    </main>
  );
}
