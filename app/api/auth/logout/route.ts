export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST() {
  try {
    clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("logout error", e);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
