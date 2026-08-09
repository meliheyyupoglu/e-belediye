import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const MAX_AGE = 60 * 60 * 24; // 24 saat

function getSecret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "dortyol-ebelediye-secret";
}

const DEMO_ADMIN_USERNAME = "admin123";
const DEMO_ADMIN_PASSWORD = "admin123";

export function verifyAdminCredentials(username: string, password: string): boolean {
  const u = username.trim();
  const p = password;
  if (u === DEMO_ADMIN_USERNAME && p === DEMO_ADMIN_PASSWORD) return true;
  const envPass = process.env.ADMIN_PASSWORD;
  if (envPass && p === envPass) {
    return u === DEMO_ADMIN_USERNAME || u === "admin" || u === "";
  }
  return false;
}

export function verifyPassword(password: string): boolean {
  return password === DEMO_ADMIN_PASSWORD || password === process.env.ADMIN_PASSWORD;
}

export function createSessionToken(): string {
  const payload = `admin:${Date.now()}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return false;
    const payload = Buffer.from(payloadB64, "base64url").toString();
    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;
    const ts = parseInt(payload.split(":")[1] || "0", 10);
    return Date.now() - ts < MAX_AGE * 1000;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export function getAdminDepartman(): string | null {
  return process.env.ADMIN_DEPARTMAN || null;
}

export { COOKIE_NAME, MAX_AGE };
