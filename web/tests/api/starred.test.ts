import { describe, it, expect, vi } from "vitest";
import { prismaMock } from "../helpers/prismaMock";
import { makeUser, makeSnippet } from "../helpers/fixtures";
import * as starredRoute from "@/app/api/snippets/starred/route";

vi.mock("@/app/actions/checkUser", () => ({
  checkUser: vi.fn(),
  checkSession: vi.fn(),
}));
import { checkUser } from "@/app/actions/checkUser";

const { POST, GET, DELETE } = starredRoute;

describe("/api/snippets/starred", () => {
  it("no longer exports a PUT handler (regression: it used to be a no-op that returned no Response)", () => {
    expect((starredRoute as Record<string, unknown>).PUT).toBeUndefined();
  });

  it("POST returns 401 when unauthenticated and never touches the DB", async () => {
    vi.mocked(checkUser).mockResolvedValue(null);

    const res = await POST(
      new Request("http://localhost/api/snippets/starred", {
        method: "POST",
        body: JSON.stringify({ snippetId: "whatever" }),
      })
    );

    expect(res.status).toBe(401);
    expect(prismaMock.starredSnippets.create).not.toHaveBeenCalled();
  });

  it("POST stars a snippet that isn't starred yet", async () => {
    const owner = makeUser();
    const snippet = makeSnippet(owner.id);
    vi.mocked(checkUser).mockResolvedValue({ id: owner.id, email: owner.email });
    prismaMock.snippets.findFirst.mockResolvedValue(snippet);
    prismaMock.starredSnippets.findFirst.mockResolvedValue(null);
    prismaMock.starredSnippets.create.mockResolvedValue({
      id: "star-1",
      userId: owner.id,
      authorId: owner.id,
      snippetId: snippet.id,
      isStarred: true,
    });

    const res = await POST(
      new Request("http://localhost/api/snippets/starred", {
        method: "POST",
        body: JSON.stringify({ snippetId: snippet.id }),
      })
    );

    expect((await res.json()).data.isStarred).toBe(true);
    expect(prismaMock.starredSnippets.create).toHaveBeenCalled();
  });

  it("POST unstars (deletes) an already-starred snippet instead of creating a duplicate", async () => {
    const owner = makeUser();
    const snippet = makeSnippet(owner.id);
    vi.mocked(checkUser).mockResolvedValue({ id: owner.id, email: owner.email });
    prismaMock.snippets.findFirst.mockResolvedValue(snippet);
    prismaMock.starredSnippets.findFirst.mockResolvedValue({
      id: "star-1",
      userId: owner.id,
      authorId: owner.id,
      snippetId: snippet.id,
      isStarred: true,
    });

    const res = await POST(
      new Request("http://localhost/api/snippets/starred", {
        method: "POST",
        body: JSON.stringify({ snippetId: snippet.id }),
      })
    );

    expect((await res.json()).data.isStarred).toBe(false);
    expect(prismaMock.starredSnippets.delete).toHaveBeenCalledWith({ where: { id: "star-1" } });
    expect(prismaMock.starredSnippets.create).not.toHaveBeenCalled();
  });

  it("GET scopes results to the caller's own stars", async () => {
    const owner = makeUser();
    vi.mocked(checkUser).mockResolvedValue({ id: owner.id, email: owner.email });
    prismaMock.starredSnippets.findMany.mockResolvedValue([]);

    await GET();

    expect(prismaMock.starredSnippets.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: owner.id } })
    );
  });

  it("DELETE actually unstars the snippet (regression: used to ignore ?id and just re-run the GET query)", async () => {
    const owner = makeUser();
    const snippet = makeSnippet(owner.id);
    vi.mocked(checkUser).mockResolvedValue({ id: owner.id, email: owner.email });
    prismaMock.starredSnippets.findFirst.mockResolvedValue({
      id: "star-1",
      userId: owner.id,
      authorId: owner.id,
      snippetId: snippet.id,
      isStarred: true,
    });
    prismaMock.starredSnippets.delete.mockResolvedValue({} as never);

    const res = await DELETE(
      new Request(`http://localhost/api/snippets/starred?id=${snippet.id}`, { method: "DELETE" })
    );

    expect(res.status).toBe(200);
    expect(prismaMock.starredSnippets.delete).toHaveBeenCalledWith({ where: { id: "star-1" } });
  });

  it("DELETE returns 404 for a snippet that isn't currently starred, without calling delete", async () => {
    const owner = makeUser();
    vi.mocked(checkUser).mockResolvedValue({ id: owner.id, email: owner.email });
    prismaMock.starredSnippets.findFirst.mockResolvedValue(null);

    const res = await DELETE(
      new Request("http://localhost/api/snippets/starred?id=some-snippet", { method: "DELETE" })
    );

    expect(res.status).toBe(404);
    expect(prismaMock.starredSnippets.delete).not.toHaveBeenCalled();
  });
});
