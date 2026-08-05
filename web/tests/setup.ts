// No real database is used for these tests - Prisma is mocked per-file via
// tests/helpers/prismaMock.ts. We still need deterministic values for the
// handful of env-driven constants (@/lib/config) that route handlers and
// jsonwebtoken sign/verify calls read directly.
process.env.JWT_SECRET ??= "test-jwt-secret";
process.env.API_SECRET ??= "test-api-secret";
process.env.NEXTAUTH_SECRET ??= "test-nextauth-secret";
process.env.NEXTAUTH_URL ??= "http://localhost:3000";
process.env.GOOGLE_CLIENT_ID ??= "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET ??= "test-google-client-secret";
process.env.GITHUB_CLIENT_ID ??= "test-github-client-id";
process.env.GITHUB_CLIENT_SECRET ??= "test-github-client-secret";
process.env.BACKEND_URL ??= "http://localhost:3000";
