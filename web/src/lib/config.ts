export const JWT_SECRET = process.env.JWT_SECRET as string;
export const API_SECRET = process.env.API_SECRET as string;
export const BACKEND_URL =
  (process.env.BACKEND_URL as string) || "https://share-snippets.site";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string;

export const DATABASE_URL = process.env.DATABASE_URL as string;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL as string;
