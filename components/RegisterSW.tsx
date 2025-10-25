"use client";

import { useEffect } from "react";

// Registra o SW apenas em produção. SW mínimo não intercepta /api/**
export default function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        try { reg.update(); } catch {}
      } catch {}
    })();

    const onFocus = () => {
      navigator.serviceWorker.getRegistration().then((r) => r?.update().catch(() => {}));
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return null;
}
