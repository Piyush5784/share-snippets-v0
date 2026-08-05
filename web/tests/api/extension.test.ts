import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prismaMock } from "../helpers/prismaMock";
import { makeUser, makeSnippet, makeApiKey } from "../helpers/fixtures";
import { GET as validateKey } from "@/app/api/extension/validate-key/route";
import { GET as extSnippets } from "@/app/api/extension/snippets/route";
import { GET as extPrivate } from "@/app/api/extension/snippets/private/route";
import { GET as extSearch } from "@/app/api/extension/snippets/search/route";
import { API_SECRET } from "@/lib/config";

function signKey(user: { id: string; email: string }) {
  return jwt.sign({ id: user.id, email: user.email }, API_SECRET, { expiresIn: "90d" });
}

function authed(url: string, token: string) {
  return new NextRequest(url, { headers: { Authorization: token } });
}

describe("extension API key auth", () => {
  it("validate-key accepts a token that matches the active apiKey", async () => {
    const user = makeUser();
    const token = signKey(user);
    prismaMock.user.findUnique.mockResolvedValue({ ...user, apiKey: makeApiKey(user.id, { key: token }) } as never);

    const res = await validateKey(authed("http://localhost/api/extension/validate-key", token));

    expect(res.status).toBe(200);
  });

  it("validate-key rejects a revoked/rotated key (regression: any validly-signed JWT used to be accepted forever)", async () => {
    const user = makeUser();
    const oldToken = signKey(user);
    prismaMock.user.findUnique.mockResolvedValue({
      ...user,
      apiKey: makeApiKey(user.id, { key: "a-newer-key" }),
    } as never);

    const res = await validateKey(authed("http://localhost/api/extension/validate-key", oldToken));

    expect(res.status).toBe(401);
  });

  it("validate-key rejects a missing Authorization header without touching the DB", async () => {
    const res = await validateKey(new NextRequest("http://localhost/api/extension/validate-key"));

    expect(res.status).toBe(401);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("extension/snippets rejects a revoked key", async () => {
    const user = makeUser();
    const oldToken = signKey(user);
    prismaMock.user.findUnique.mockResolvedValue({
      ...user,
      apiKey: makeApiKey(user.id, { key: "rotated" }),
    } as never);

    const res = await extSnippets(authed("http://localhost/api/extension/snippets", oldToken));

    expect(res.status).toBe(401);
    expect(prismaMock.snippets.findMany).not.toHaveBeenCalled();
  });

  it("extension/snippets/private scopes the query to the caller's own id", async () => {
    const user = makeUser();
    const token = signKey(user);
    prismaMock.user.findUnique.mockResolvedValue({ ...user, apiKey: makeApiKey(user.id, { key: token }) } as never);
    prismaMock.snippets.findMany.mockResolvedValue([makeSnippet(user.id, { title: "mine" })]);

    const res = await extPrivate(authed("http://localhost/api/extension/snippets/private", token));
    const body = await res.json();

    expect(body.data).toHaveLength(1);
    expect(prismaMock.snippets.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: user.id } })
    );
  });

  it("extension/snippets/search reads the token from the Authorization header (regression: it used to require ?token= in the URL)", async () => {
    const user = makeUser();
    const token = signKey(user);
    prismaMock.user.findUnique.mockResolvedValue({ ...user, apiKey: makeApiKey(user.id, { key: token }) } as never);
    prismaMock.snippets.findMany.mockResolvedValue([makeSnippet(user.id, { title: "findme" })]);

    const res = await extSearch(
      authed("http://localhost/api/extension/snippets/search?title=findme", token)
    );
    expect(res.status).toBe(200);

    // putting the (valid) token in the URL query string instead must now fail
    const noHeaderRes = await extSearch(
      new NextRequest(`http://localhost/api/extension/snippets/search?token=${token}`)
    );
    expect(noHeaderRes.status).toBe(401);
  });
});
