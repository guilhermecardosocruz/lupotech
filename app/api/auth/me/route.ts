export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { readSession } from "../../../../lib/session";

export async function GET() {
  try {
    const sess = await readSession();
    if (!sess) return NextResponse.json({ ok: false }, { status: 401 }, { headers: { "Cache-Control": "no-store" } });

    const user = await prisma.user.findUnique({ where: { id: sess.sub } });
    if (!user) return NextResponse.json({ ok: false }, { status: 401 }, { headers: { "Cache-Control": "no-store" } });

    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("me error", e);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 }, { headers: { "Cache-Control": "no-store" } });
  }
}
