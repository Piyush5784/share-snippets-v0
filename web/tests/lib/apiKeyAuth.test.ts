import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import { prismaMock } from "../helpers/prismaMock";
import { makeUser, makeApiKey } from "../helpers/fixtures";
import { API_SECRET } from "@/lib/config";
import { verifyApiKey } from "@/lib/apiKeyAuth";

function signKey(payload: object, secret = API_SECRET) {
  return jwt.sign(payload, secret, { expiresIn: "90d" });
}

describe("verifyApiKey", () => {
  it("accepts a token that matches the user's currently stored apiKey", async () => {
    const user = makeUser();
    const token = signKey({ id: user.id, email: user.email });
    prismaMock.user.findUnique.mockResolvedValue({
      ...user,
      apiKey: makeApiKey(user.id, { key: token }),
    } as never);

    const result = await verifyApiKey(token);

    expect(result?.id).toBe(user.id);
  });

  it("rejects a well-formed token whose key has since been rotated (regression: old tokens used to work forever)", async () => {
    const user = makeUser();
    const oldToken = signKey({ id: user.id, email: user.email });
    prismaMock.user.findUnique.mockResolvedValue({
      ...user,
      apiKey: makeApiKey(user.id, { key: "a-newer-key" }),
    } as never);

    const result = await verifyApiKey(oldToken);

    expect(result).toBeNull();
  });

  it("rejects a token for a user that no longer exists", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const token = signKey({ id: "does-not-exist", email: "ghost@example.com" });

    const result = await verifyApiKey(token);

    expect(result).toBeNull();
  });

  it("rejects a token whose email no longer matches the user's current email", async () => {
    const user = makeUser({ email: "current-email@example.com" });
    const token = signKey({ id: user.id, email: "stale-email@example.com" });
    prismaMock.user.findUnique.mockResolvedValue({
      ...user,
      apiKey: makeApiKey(user.id, { key: token }),
    } as never);

    const result = await verifyApiKey(token);

    expect(result).toBeNull();
  });

  it("rejects a token when the user has no ApiKey row at all", async () => {
    const user = makeUser();
    const token = signKey({ id: user.id, email: user.email });
    prismaMock.user.findUnique.mockResolvedValue({ ...user, apiKey: null } as never);

    const result = await verifyApiKey(token);

    expect(result).toBeNull();
  });

  it("throws on a token signed with the wrong secret", async () => {
    const token = signKey({ id: "x", email: "x@example.com" }, "wrong-secret");

    await expect(verifyApiKey(token)).rejects.toThrow();
  });
});
