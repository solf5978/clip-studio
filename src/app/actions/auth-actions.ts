// src/app/actions/auth-actions.ts
"use server";

import { signIn, signOut } from "../../lib/auth";

export async function signInWithGoogle() {
  await signIn("google");
}

export async function signOutAction() {
  await signOut();
}

// 1. Define the response from Cloudflare
interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const token = formData.get("cf-turnstile-response") as string;

  if (!email || !token) {
    return { error: "Email and token are required." };
  }

  // 2. Verify the token with Cloudflare
  const res = await fetch(
    "https://challenges.cloudflare.com/api/v1/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  );

  const data: TurnstileResponse = await res.json();

  // 3. Check if verification was successful
  if (!data.success) {
    return { error: "CAPTCHA verification failed. Please try again." };
  }

  // 4. If successful, proceed with the magic link sign-in
  try {
    await signIn("email", { email: email, redirect: false });
    return { success: "Check your email for a sign-in link!" };
  } catch (err) {
    return { error: "Something went wrong. Please try again." };
  }
}
