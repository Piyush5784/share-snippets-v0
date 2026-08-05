import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { prismaMock } from "../helpers/prismaMock";
import { makeUser } from "../helpers/fixtures";
import { GET } from "@/app/api/public-snippets/route";

vi.mock("@/app/actions/checkUser", () => ({
  checkUser: vi.fn(),
  checkSession: vi.fn(),
}));
import { checkSession } from "@/app/actions/checkUser";

describe("GET /api/public-snippets pagination", () => {
  it("returns 401 when unauthenticated", async () => {
    vi.mocked(checkSession).mockResolvedValue(null);

    const res = await GET(new NextRequest("http://localhost/api/public-snippets"));

    expect(res.status).toBe(401);
    expect(prismaMock.snippets.findMany).not.toHaveBeenCalled();
  });

  it("page 1 skips 0 (regression: the 'p' query param used to be read and then ignored)", async () => {
    const owner = makeUser();
    vi.mocked(checkSession).mockResolvedValue({ id: owner.id, email: owner.email });
    prismaMock.snippets.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost/api/public-snippets?p=1"));

    expect(prismaMock.snippets.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 5 })
    );
  });

  it("page 2 skips a full page (regression: previously every page returned the same 5 rows)", async () => {
    const owner = makeUser();
    vi.mocked(checkSession).mockResolvedValue({ id: owner.id, email: owner.email });
    prismaMock.snippets.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost/api/public-snippets?p=2"));

    expect(prismaMock.snippets.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 })
    );
  });

  it("treats a missing/invalid 'p' as page 1", async () => {
    const owner = makeUser();
    vi.mocked(checkSession).mockResolvedValue({ id: owner.id, email: owner.email });
    prismaMock.snippets.findMany.mockResolvedValue([]);

    await GET(new NextRequest("http://localhost/api/public-snippets?p=not-a-number"));

    expect(prismaMock.snippets.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 5 })
    );
  });
});
