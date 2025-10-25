"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrestadorHome(){
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/auth/me", { cache: "no-store" });
        if (!r.ok) { router.replace("/login"); return; }
        const j = await r.json().catch(()=>null);
        if (!j?.user) { router.replace("/login"); return; }
        if (j.user.role !== "PRESTADOR") { router.replace("/cliente"); return; }
      } catch {
        router.replace("/login");
      }
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <main style={{ maxWidth: 980, margin:"0 auto", padding:24 }}>
      <h1 style={{ marginTop: 12 }}>Área do prestador</h1>
      <p className="muted">Complete seu perfil e defina sua disponibilidade.</p>
    </main>
  );
}
