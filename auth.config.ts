// src/auth.config.ts
import type NextAuthConfig from "next-auth";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";

// This is your EDGE-SAFE config
export const authConfig = {
  providers: [
    Google,
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,

      // ... your email provider config
    }),
  ],
  pages: {
    signIn: "/sign-in", // Your custom sign-in page
  },
  callbacks: {
    // ... your callbacks (jwt, session, etc.)
    // authorized() is often used by middleware
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnEditPage = nextUrl.pathname.startsWith("/edit");

      if (isOnEditPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
} satisfies typeof NextAuthConfig;
