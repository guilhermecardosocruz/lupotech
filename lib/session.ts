import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "session";
const DAYS_30 = 60 * 60 * 24 * 30;

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET ausente");
  return s;
}

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export type SessionPayload = {
  sub: string;
  email: string;
  role: "CLIENTE" | "PRESTADOR";
  name?: string | null;
  iat: number;
  exp: number;
};

export function signSession(payload: Omit<SessionPayload, "iat" | "exp">, maxAgeSeconds = DAYS_30) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const full: SessionPayload = { ...payload, iat: now, exp: now + maxAgeSeconds };

  const h = base64url(JSON.stringify(header));
  const p = base64url(JSON.stringify(full));
  const data = `${h}.${p}`;

  const sig = crypto.createHmac("sha256", getSecret()).update(data).digest();
  const s = base64url(sig);
  return `${data}.${s}`;
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const [h, p, s] = token.split(".");
    if (!h || !p || !s) return null;
    const data = `${h}.${p}`;
    const expected = base64url(crypto.createHmac("sha256", getSecret()).update(data).digest());
    if (!crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected))) return null;

    const payload = JSON.parse(Buffer.from(p, "base64").toString()) as SessionPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(payload: Omit<SessionPayload, "iat" | "exp">) {
  const token = signSession(payload);
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    maxAge: DAYS_30,
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 0,
  });
}

export function readSession(): SessionPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}
