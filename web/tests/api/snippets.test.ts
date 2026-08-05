import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { prismaMock } from "../helpers/prismaMock";
import { makeUser, makeSnippet } from "../helpers/fixtures";
import { POST, PATCH, DELETE, GET } from "@/app/api/snippets/route";

vi.mock("@/app/actions/checkUser", () => ({
  checkUser: vi.fn(),
  checkSession: vi.fn(),
}));
import { checkUser } from "@/app/actions/checkUser";

const validBody = {
  title: "hello",
  isPublic: true,
  language: "typescript",
  code: "console.log(1)",
  tags: [] as string[],
};

function req(url: string, init: RequestInit = {}) {
  return new NextRequest(new Request(url, init));
}

describe("PATCH /api/snippets (ownership/authorization)", () => {
  it("rejects an unauthenticated request without touching the DB (IDOR regression)", async () => {
    vi.mocked(checkUser).mockResolvedValue(null);

    const res = await PATCH(
      req("http://localhost/api/snippets?id=snippet-1", {
        method: "PATCH",
        body: JSON.stringify({ ...validBody, title: "hacked" }),
      })
    );

    expect(res.status).toBe(401);
    expect(prismaMock.snippets.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.snippets.update).not.toHaveBeenCalled();
  });

  it("scopes the lookup to the caller's own id (so a non-owner never matches)", async () => {
    const attacker = makeUser();
    vi.mocked(checkUser).mockResolvedValue({ id: attacker.id, email: attacker.email });
    // Simulates Prisma correctly finding nothing for this user+id combination.
    prismaMock.snippets.findUnique.mockResolvedValue(null);

    const res = await PATCH(
      req("http://localhost/api/snippets?id=someone-elses-snippet", {
        method: "PATCH",
        body: JSON.stringify({ ...validBody, title: "hacked" }),
      })
    );

    expect(res.status).toBe(404);
    expect(prismaMock.snippets.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ user: { id: attacker.id } }),
      })
    );
    expect(prismaMock.snippets.update).not.toHaveBeenCalled();
  });

  it("lets the owner update their own snippet", async () => {
    const owner = makeUser();
    const snippet = makeSnippet(owner.id, { title: "original" });
    vi.mocked(checkUser).mockResolvedValue({ id: owner.id, email: owner.email });
    prismaMock.snippets.findUnique.mockResolvedValue(snippet);
    prismaMock.snippets.update.mockResolvedValue({ ...snippet, title: "updated" });

    const res = await PATCH(
      req(`http://localhost/api/snippets?id=${snippet.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...validBody, title: "updated" }),
      })
    );

    expect(res.status).toBe(200);
    expect(prismaMock.snippets.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: owner.id, id: snippet.id } })
    );
  });

  it("returns 400, not 500, for an invalid payload", async () => {
    const owner = makeUser();
    const snippet = makeSnippet(owner.id);
    vi.mocked(checkUser).mockResolvedValue({ id: owner.id, email: owner.email });
    prismaMock.snippets.findUnique.mockResolvedValue(snippet);

    const res = await PATCH(
      req(`http://localhost/api/snippets?id=${snippet.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: "missing required fields" }),
      })
    );

    expect(res.status).toBe(400);
  });
});

describe("POST /api/snippets", () => {
  it("returns 401 when unauthenticated and never calls create", async () => {
    vi.mocked(checkUser).mockResolvedValue(null);

    const res = await POST(
      req("http://localhost/api/snippets", { method: "POST", body: JSON.stringify(validBody) })
    );

    expect(res.status).toBe(401);
    expect(prismaMock.snippets.create).not.toHaveBeenCalled();
  });

  it("returns 400, not 500, for an invalid payload", async () => {
    const user = makeUser();
    vi.mocked(checkUser).mockResolvedValue({ id: user.id, email: user.email });

    const res = await POST(
      req("http://localhost/api/snippets", {
        method: "POST",
        body: JSON.stringify({ title: "no other fields" }),
      })
    );

    expect(res.status).toBe(400);
    expect(prismaMock.snippets.create).not.toHaveBeenCalled();
  });

  it("creates a snippet connected to the authenticated user", async () => {
    const user = makeUser();
    vi.mocked(checkUser).mockResolvedValue({ id: user.id, email: user.email });
    prismaMock.snippets.create.mockResolvedValue(makeSnippet(user.id));

    const res = await POST(
      req("http://localhost/api/snippets", { method: "POST", body: JSON.stringify(validBody) })
    );

    expect(res.status).toBe(201);
    expect(prismaMock.snippets.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ user: { connect: { id: user.id } } }),
      })
    );
  });
});

describe("GET /api/snippets", () => {
  it("scopes the query to the authenticated user's own snippets", async () => {
    const user = makeUser();
    vi.mocked(checkUser).mockResolvedValue({ id: user.id, email: user.email });
    prismaMock.snippets.findMany.mockResolvedValue([makeSnippet(user.id, { title: "mine" })] as never);

    const res = await GET();
    const body = await res.json();

    expect(body.data).toHaveLength(1);
    expect(prismaMock.snippets.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { user: { id: user.id } } })
    );
  });
});

describe("DELETE /api/snippets", () => {
  it("returns 404, not 500, when Prisma can't find a matching (owned) record (regression: dead `if (!snippet)` check never ran because delete() throws instead of returning null)", async () => {
    const attacker = makeUser();
    vi.mocked(checkUser).mockResolvedValue({ id: attacker.id, email: attacker.email });
    const notFoundError = Object.assign(new Error("Record not found"), { code: "P2025" });
    prismaMock.snippets.delete.mockRejectedValue(notFoundError);

    const res = await DELETE(
      req("http://localhost/api/snippets?id=someone-elses-snippet", { method: "DELETE" })
    );

    expect(res.status).toBe(404);
  });

  it("lets the owner delete their own snippet, scoped by id", async () => {
    const owner = makeUser();
    const snippet = makeSnippet(owner.id);
    vi.mocked(checkUser).mockResolvedValue({ id: owner.id, email: owner.email });
    prismaMock.snippets.delete.mockResolvedValue(snippet);

    const res = await DELETE(
      req(`http://localhost/api/snippets?id=${snippet.id}`, { method: "DELETE" })
    );

    expect(res.status).toBe(200);
    expect(prismaMock.snippets.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: snippet.id, user: { id: owner.id } } })
    );
  });
});
