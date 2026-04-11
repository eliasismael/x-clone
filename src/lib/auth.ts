import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";

const SESSION_BYTES = 32;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken() {
  return randomBytes(SESSION_BYTES).toString("hex");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
