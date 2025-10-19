// src/middleware.ts
import { auth } from "@/lib/auth";

export default auth;

export const config = {
  // The matcher specifies which routes the middleware should run on.
  matcher: ["/dashboard/:path*"],
};
