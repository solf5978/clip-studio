// src/components/sign-in-dialog.tsx
"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { signInWithGoogle, signInWithEmail } from "@/app/actions/auth-actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Turnstile } from "@marsidev/react-turnstile";

export const SignInDialogContent = () => {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);
  const [token, setToken] = useState<string | null>(null);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Welcome</DialogTitle>
        <DialogDescription>
          Sign in or create an account to continue.
        </DialogDescription>
      </DialogHeader>

      <form action={signInWithGoogle} className="mt-4">
        <Button type="submit" className="w-full">
          Continue with Google
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <form action={formAction}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email" // Add name attribute
            type="email"
            placeholder="name@example.com"
            required
          />
        </div>
        <Turnstile
          onSuccess={setToken} // Store the token in state
          options={{ theme: "light" }}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          className="my-4"
        />
        <Button
          type="submit"
          className="w-full"
          // Disable button if form is submitting or CAPTCHA is not ready
          disabled={isPending || !token}
        >
          {isPending ? "Sending..." : "Continue with Email"}
        </Button>
      </form>
      {state?.error && (
        <p className="mt-4 text-center text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="mt-4 text-center text-sm text-green-600">
          {state.success}
        </p>
      )}
    </DialogContent>
  );
};
