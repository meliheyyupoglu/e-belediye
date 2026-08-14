import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const CITIZEN_COOKIE = "citizen_session";
export const CITIZEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

function getSecret(): string {
  return process.env.ADMIN_SECRET || process.env.CITIZEN_SECRET || "dortyol-citizen-secret";
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const derived = scryptSync(password, salt, 64);
    const storedBuf = Buffer.from(hash, "hex");
    if (derived.length !== storedBuf.length) return false;
    return timingSafeEqual(derived, storedBuf);
  } catch {
    return false;
  }
}

export function createCitizenSessionToken(userId: number): string {
  const payload = `citizen:${userId}:${Date.now()}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function verifyCitizenSessionToken(token: string | undefined | null): number | null {
  if (!token) return null;
  try {
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;
    const payload = Buffer.from(payloadB64, "base64url").toString();
    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
    const parts = payload.split(":");
    if (parts[0] !== "citizen") return null;
    const userId = parseInt(parts[1] || "0", 10);
    const ts = parseInt(parts[2] || "0", 10);
    if (!userId || Date.now() - ts >= CITIZEN_MAX_AGE * 1000) return null;
    return userId;
  } catch {
    return null;
  }
}

export async function getCitizenUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  return verifyCitizenSessionToken(cookieStore.get(CITIZEN_COOKIE)?.value);
}
