import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password, role } = body || {};

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    if (!["CLIENTE","PRESTADOR"].includes(role)) {
      return NextResponse.json({ error: "Role inválida" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
    }

    // !! demo: sem hash para simplificar. Trocar por bcrypt depois.
    const user = await prisma.user.create({
      data: { name, email, role, passwordHash: password }
    });

    // retorna só campos públicos
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 });
  } catch (e: any) {
    console.error("register error", e);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
