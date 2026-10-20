import { SignInButton } from "@/components/auth/sign-in-button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex h-18 items-center border-b px-4">
        <span className="text-xl font-bold tracking-tight">Simple Trading</span>
      </header>
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start justify-center gap-6 px-6 py-16">
        <p className="text-primary text-sm font-medium tracking-wide uppercase">
          Simple Trading
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Behalte deine Trades im Blick.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Analysiere und verwalte deine Trading-Aktivitäten an einem Ort.
        </p>
        <SignInButton />
      </section>
      <footer className="text-muted-foreground/50 border-t px-4 py-6 text-center text-xs">
        Some Footer
      </footer>
    </main>
  );
}
