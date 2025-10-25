export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { clearSessionCookie } from "../../../../lib/session";

export async function POST() {
  try {
    await await clearSessionCookie();
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("logout error", e);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 }, { headers: { "Cache-Control": "no-store" } });
  }
}
