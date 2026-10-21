"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export function SignOutButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function signOut() {
    setError(null);
    setIsPending(true);

    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError(result.error.message || "Die Abmeldung ist fehlgeschlagen.");
        setIsPending(false);
        return;
      }

      router.replace("/");
    } catch {
      setError("Die Abmeldung ist fehlgeschlagen.");
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end">
      <Button
        variant="outline"
        size="sm"
        onClick={signOut}
        disabled={isPending}
      >
        {isPending ? "Abmelden ..." : "Abmelden"}
      </Button>
      {error && (
        <p
          role="alert"
          className="text-destructive absolute top-full right-4 text-xs"
        >
          {error}
        </p>
      )}
    </div>
  );
}
