import prisma from "../../../../lib/prisma";

export async function GET() {
  const count = await prisma.user.count();
  return new Response(JSON.stringify({ count }), {
    headers: { "content-type": "application/json" },
  });
}
