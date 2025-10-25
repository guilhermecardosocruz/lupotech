export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { setSessionCookie } from "../../../../lib/session";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function POST(req: Request) {
  try{
    const { email, password, role } = await req.json().catch(() => ({}));
    if (!email || !password || !role)
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400, headers: NO_STORE });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.passwordHash !== password)
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401, headers: NO_STORE });

    if (user.role !== role)
      return NextResponse.json({ error: "Tipo de conta incorreto" }, { status: 401, headers: NO_STORE });

    await setSessionCookie({ sub: user.id, email: user.email, role: user.role as any, name: user.name });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { headers: NO_STORE });
  }catch(e){
    console.error("login error", e);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500, headers: NO_STORE });
  }
}
