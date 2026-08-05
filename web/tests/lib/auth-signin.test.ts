import { describe, it, expect } from "vitest";
import { prismaMock } from "../helpers/prismaMock";
import { makeUser } from "../helpers/fixtures";
import { nextAuthOptions } from "@/lib/auth";

const signIn = nextAuthOptions.callbacks!.signIn!;

describe("nextAuthOptions.callbacks.signIn (OAuth)", () => {
  it("creates a new GitHub user with provider GITHUB (regression: used to always fall back to CREDENTIALS)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const created = makeUser({ email: "gh-user@example.com", provider: "GITHUB" });
    prismaMock.user.create.mockResolvedValue(created);

    const user: any = { email: "gh-user@example.com", name: "GH User", image: null, id: "github-raw-account-id" };
    const account: any = { provider: "github" };

    const ok = await signIn({ user, account } as any);

    expect(ok).toBe(true);
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ provider: "GITHUB" }) })
    );
  });

  it("creates a new Google user with provider GOOGLE", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const created = makeUser({ email: "google-user@example.com", provider: "GOOGLE" });
    prismaMock.user.create.mockResolvedValue(created);

    const user: any = { email: "google-user@example.com", name: "Google User", image: null, id: "google-raw-account-id" };
    const account: any = { provider: "google" };

    await signIn({ user, account } as any);

    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ provider: "GOOGLE" }) })
    );
  });

  it("rewrites user.id to the Prisma User.id on first sign-in (regression: session.user.id used to stay the raw OAuth account id)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const created = makeUser({ email: "id-check@example.com", provider: "GITHUB" });
    prismaMock.user.create.mockResolvedValue(created);

    const user: any = {
      email: "id-check@example.com",
      name: "Id Check",
      image: null,
      id: "raw-oauth-account-id-should-not-survive",
    };
    const account: any = { provider: "github" };

    await signIn({ user, account } as any);

    expect(user.id).toBe(created.id);
    expect(user.id).not.toBe("raw-oauth-account-id-should-not-survive");
  });

  it("rewrites user.id for a returning OAuth user too, without creating a duplicate", async () => {
    const existing = makeUser({ email: "returning@example.com", provider: "GOOGLE" });
    prismaMock.user.findUnique.mockResolvedValue(existing);

    const user: any = {
      email: "returning@example.com",
      name: "Returning",
      image: null,
      id: "a-different-raw-oauth-id-this-time",
    };
    const account: any = { provider: "google" };

    await signIn({ user, account } as any);

    expect(user.id).toBe(existing.id);
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });
});
