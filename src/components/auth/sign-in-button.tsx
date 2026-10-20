"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function signIn() {
    setError(null);
    setIsPending(true);

    try {
      const result = await authClient.signIn.social({
        provider: "microsoft",
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message || "Die Anmeldung ist fehlgeschlagen.");
        setIsPending(false);
      }
    } catch {
      setError("Die Anmeldung konnte nicht gestartet werden.");
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={signIn} disabled={isPending}>
        {isPending
          ? "Weiterleitung zu Microsoft ..."
          : "Mit Microsoft anmelden"}
      </Button>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
