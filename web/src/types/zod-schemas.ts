import z, { email } from "zod";

export const schema = z.object({
  email: z.email(),
  password: z.string().min(4),
});
export const createSnippet = z.object({
  title: z.string(),
  description: z.string().optional(),
  isPublic: z.boolean(),
  language: z.string(),
  code: z.string(),
  tags: z.array(z.string()).optional(),
});

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string(),
});
