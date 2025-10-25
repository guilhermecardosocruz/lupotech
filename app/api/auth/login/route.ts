export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { setSessionCookie } from "../../../../lib/session";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json().catch(() => ({}));
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 }, { headers: { "Cache-Control": "no-store" } });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 }, { headers: { "Cache-Control": "no-store" } });

    // DEMO: comparando com passwordHash em texto plano (igual ao register atual)
    if (user.passwordHash !== password) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 }, { headers: { "Cache-Control": "no-store" } });
    }
    if (user.role !== role) {
      return NextResponse.json({ error: "Tipo de conta incorreto" }, { status: 401 }, { headers: { "Cache-Control": "no-store" } });
    }

    await await setSessionCookie({ sub: user.id, email: user.email, role: user.role as any, name: user.name });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 200 }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("login error", e);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 }, { headers: { "Cache-Control": "no-store" } });
  }
}
