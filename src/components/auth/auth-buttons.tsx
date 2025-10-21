// src/components/auth-buttons.tsx
import {
  signInWithGoogle,
  signOutAction,
} from "../../app/actions/auth-actions";
import { Button } from "../ui/button";

export function AuthButtons() {
  return (
    <div className="flex items-center space-x-2">
      {/* Sign In Button */}
      <form action={signInWithGoogle}>
        <Button
          type="submit"
          variant="ghost"
          className="hover:text-blue-600 transition-colors"
        >
          Sign In
        </Button>
      </form>

      {/* Sign Up Button (also triggers sign-in) */}
      <form action={signInWithGoogle}>
        <Button type="submit" className="hover:bg-blue-700 transition-colors">
          Sign Up
        </Button>
      </form>
    </div>
  );
}

export function SignOut() {
  return (
    <form action={signOutAction} className="w-full">
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start px-2 py-1.5 text-sm"
      >
        Sign Out
      </Button>
    </form>
  );
}
