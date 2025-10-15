import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string;
    image?: string;
    name?: string;
  }

  interface Session {
    user: {
      id?: string;
      email?: string;
      image?: string;
      name?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    image?: string;
    name?: string;
  }
}
