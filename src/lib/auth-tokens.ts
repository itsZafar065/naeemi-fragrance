import crypto from "crypto";
import { getDb } from "@/lib/db";

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function revokeJwt(token: string, expiresAt?: number) {
  const db = await getDb();
  await db.collection("revoked_tokens").updateOne(
    { tokenHash: hashToken(token) },
    {
      $set: {
        tokenHash: hashToken(token),
        expiresAt: expiresAt ? new Date(expiresAt * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        revokedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

export async function isJwtRevoked(token: string): Promise<boolean> {
  const db = await getDb();
  await db.collection("revoked_tokens").deleteMany({ expiresAt: { $lt: new Date() } });
  const revoked = await db.collection("revoked_tokens").findOne({ tokenHash: hashToken(token) });
  return !!revoked;
}
