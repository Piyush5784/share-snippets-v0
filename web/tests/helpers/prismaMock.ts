import { PrismaClient } from "@prisma/client";
import { beforeEach, vi } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";

vi.mock("@/lib/db", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

// Importing after vi.mock (hoisted by Vitest) gets us the mock instance.
import { prisma } from "@/lib/db";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
