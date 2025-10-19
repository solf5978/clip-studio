import { type Role } from "@prisma/client"; // Import your Role enum
import NextAuth, { type DefaultSession } from "next-auth";

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role;
  }
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the
   * `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's database ID. */
      id: string;
      /** The user's role. */
      role: Role;
    } & DefaultSession["user"]; // Merge with the default user properties
  }

  interface User {
    // Add the role property to the User model
    role: Role;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth` middleware */
  interface JWT {
    /** The user's role */
    role: Role;
    /** The user's database ID */
    id: string;
  }
}
