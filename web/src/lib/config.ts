export const JWT_SECRET = process.env.JWT_SECRET as string;
export const API_SECRET = process.env.API_SECRET as string;
export const BACKEND_URL =
  (process.env.BACKEND_URL as string) || "https://share-snippets.site";

export const DATABASE_URL = process.env.DATABASE_URL as string;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL as string;
