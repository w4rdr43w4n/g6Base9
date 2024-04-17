import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import LinkedInProvider from "next-auth/providers/linkedin";
import Github from "next-auth/providers/github";
import { login } from "@/app/lib/Auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/app/lib/db";
import { User } from "@prisma/client";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "G6 Account",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        const resp = await login(
          credentials?.username as string,
          credentials?.password as string
        );
        console.log(resp.data.token);
        const user: User = {
          id: resp.data.userId,
          name: credentials?.username as string,
          email: resp.data.email,
          emailVerified: null,
          password: null,
          image: "",
          token: null,
          isVerified: true,
          expirationTime: null,
        };
        if (resp.status === 200) {
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      id: "google",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Github({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      id: "github",
      name: "GitHub",
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "read:user user:email" },
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      id: "linkedin",
      name: "LinkedIn",
      client: { token_endpoint_auth_method: "client_secret_post" },
      issuer: "https://www.linkedin.com",
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }),
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
 /* pages: {
    signIn: "/login",
    signOut: "/signout",
  },*/
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 3600,
  },
  callbacks: {
    jwt: async ({ token, user}) => {  
      console.log(user)
      if(user){    
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.name) {
        session.user = {
          name: token.name,
          email: token.email,
          image: token.picture,
        };
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log("Signed in");
    },
    async signOut() {
      console.log("Signed out");
    },
  },
};
