import type { ApiKey, Snippets, User } from "@prisma/client";

let counter = 0;
function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-${counter}`;
}

export function makeUser(overrides: Partial<User> = {}): User {
  const id = overrides.id ?? nextId("user");
  return {
    id,
    email: `test-${id}@example.com`,
    name: "Test User",
    image: null,
    password: null,
    provider: "CREDENTIALS",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function makeSnippet(userId: string, overrides: Partial<Snippets> = {}): Snippets {
  const id = overrides.id ?? nextId("snippet");
  return {
    id,
    title: "Test snippet",
    description: null,
    isPublic: true,
    language: "typescript",
    code: "console.log('hi')",
    tags: [],
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function makeApiKey(userId: string, overrides: Partial<ApiKey> = {}): ApiKey {
  const id = overrides.id ?? nextId("apikey");
  return {
    id,
    key: "fake-key",
    userId,
    createdAt: new Date(),
    ...overrides,
  };
}
