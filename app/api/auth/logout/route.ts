export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { clearSessionCookie } from "../../../../lib/session";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function POST() {
  try{
    await clearSessionCookie();
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  }catch(e){
    console.error("logout error", e);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500, headers: NO_STORE });
  }
}
