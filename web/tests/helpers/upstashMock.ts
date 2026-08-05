import { vi } from "vitest";

// middleware.ts only constructs limiters when both env vars are set (see
// tests/setup.ts), then talks to them purely through `new Ratelimit(...)`
// and `.limit(key)` - so a small in-memory fake reproducing that surface is
// enough to test the real rate-limit logic without hitting real Upstash.
vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: () => ({}) },
}));

vi.mock("@upstash/ratelimit", () => {
  type Window = { tokens: number; windowMs: number };

  class FakeRatelimit {
    private buckets = new Map<string, { count: number; resetAt: number }>();
    private window: Window;

    constructor(opts: { limiter: Window }) {
      this.window = opts.limiter;
    }

    async limit(key: string) {
      const now = Date.now();
      const existing = this.buckets.get(key);

      if (!existing || existing.resetAt <= now) {
        const resetAt = now + this.window.windowMs;
        this.buckets.set(key, { count: 1, resetAt });
        return { success: true, limit: this.window.tokens, remaining: this.window.tokens - 1, reset: resetAt };
      }

      existing.count += 1;
      return {
        success: existing.count <= this.window.tokens,
        limit: this.window.tokens,
        remaining: Math.max(0, this.window.tokens - existing.count),
        reset: existing.resetAt,
      };
    }

    static slidingWindow(tokens: number, window: string): Window {
      const [amountStr, unit] = window.split(" ");
      const amount = Number(amountStr);
      const unitMs = unit === "s" ? 1000 : unit === "m" ? 60_000 : unit === "h" ? 3_600_000 : 1000;
      return { tokens, windowMs: amount * unitMs };
    }
  }

  return { Ratelimit: FakeRatelimit };
});
