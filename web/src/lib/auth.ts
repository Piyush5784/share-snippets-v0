import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET,
} from "./config";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      httpOptions: {
        timeout: 10000,
      },
    }),

    GitHubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            password: true,
            id: true,
            email: true,
            name: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/pages/login",
    error: "/pages/error",
    // signOut: '/auth/signout',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.image = user.image;
        token.name = user.name;
      }
      return token;
    },
    async signIn({ account, user }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const email = user.email;

        if (!email) {
          console.error(`No email provided for ${account.provider} sign-in`);
          return false;
        }

        try {
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (existingUser) {
            await prisma.user.update({
              where: { email },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                ...(existingUser.provider === "CREDENTIALS"
                  ? {}
                  : {
                      provider: account.provider.toUpperCase() as "GOOGLE",
                    }),
              },
            });
          } else {
            await prisma.user.create({
              data: {
                email,
                name: user.name || null,
                image: user.image || null,
                provider: account.provider.toUpperCase() as "GOOGLE",
              },
            });
          }

          return true;
        } catch (error) {
          console.error(`Error during ${account.provider} sign-in:`, error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  secret: NEXTAUTH_SECRET,
};
