import { describe, it, expect } from "vitest";
import { prismaMock } from "../helpers/prismaMock";
import { makeUser } from "../helpers/fixtures";
import { POST } from "@/app/api/register/route";

function registerRequest(body: unknown) {
  return new Request("http://localhost/api/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/register", () => {
  it("creates a CREDENTIALS user, not GOOGLE (regression: signup used to hardcode provider: GOOGLE)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(makeUser({ email: "ada@example.com", provider: "CREDENTIALS" }));

    const res = await POST(
      registerRequest({ name: "Ada", email: "ada@example.com", password: "password123" })
    );

    expect(res.status).toBe(201);
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ provider: "CREDENTIALS" }) })
    );
  });

  it("never writes apiKey on the User record (regression: used to write apiKey: '' and collide under the old unique index)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(makeUser({ email: "ada@example.com" }));

    await POST(registerRequest({ name: "Ada", email: "ada@example.com", password: "password123" }));

    const callArg = prismaMock.user.create.mock.calls[0][0];
    expect(callArg.data).not.toHaveProperty("apiKey");
  });

  it("returns 409 for a duplicate email", async () => {
    prismaMock.user.findUnique.mockResolvedValue(makeUser({ email: "ada@example.com" }));

    const res = await POST(
      registerRequest({ name: "Ada Again", email: "ada@example.com", password: "password123" })
    );

    expect(res.status).toBe(409);
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it("returns 400, not 500, for an invalid payload (regression: validation failures returned 500)", async () => {
    const res = await POST(
      registerRequest({ name: "Ada", email: "not-an-email", password: "short" })
    );

    expect(res.status).toBe(400);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("stores a bcrypt hash, not the raw password", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(makeUser({ email: "ada@example.com" }));

    await POST(registerRequest({ name: "Ada", email: "ada@example.com", password: "password123" }));

    const callArg = prismaMock.user.create.mock.calls[0][0];
    expect(callArg.data.password).toBeTruthy();
    expect(callArg.data.password).not.toBe("password123");
  });
});
