import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { API_SECRET } from "@/lib/config";

export type ApiKeyPayload = {
  id: string;
  email: string;
};

/**
 * Verifies a VS Code extension API key.
 *
 * Checks the JWT signature/expiry, then confirms the token still matches the
 * user's currently active `User.apiKey` in the database. That DB check is
 * what makes a key revocable: clearing or rotating `apiKey` invalidates every
 * previously issued token immediately, instead of the token staying valid
 * until it expires on its own.
 *
 * Throws if the JWT is malformed/expired (same as the raw `jwt.verify` it
 * wraps) so callers can distinguish "bad token" from "unrecognised token" if
 * they want to; returns `null` for a well-formed token that no longer maps to
 * an active key.
 */
export async function verifyApiKey(token: string) {
  const payload = jwt.verify(token, API_SECRET) as ApiKeyPayload;

  if (!payload?.id || !payload?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    include: { apiKey: true },
  });

  if (!user || user.email !== payload.email || user.apiKey?.key !== token) {
    return null;
  }

  return user;
}
