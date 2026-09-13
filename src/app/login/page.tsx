"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const params = useSearchParams();
  const [username, setUsername] = useState("sree");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: params.get("callbackUrl") || "/home",
    });
    if (result?.error) {
      setError("That password didn’t match. Try again, cutie.");
      return;
    }
    window.location.href = params.get("callbackUrl") || "/home";
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-3xl bg-white/80 p-8 shadow-soft">
      <h1 className="font-display text-4xl">Log in</h1>
      <p className="text-sm text-muted">Only Sree and Dhanush live here.</p>
      <div className="grid grid-cols-2 gap-2">
        {["sree", "dhanush"].map((name) => (
          <button
            type="button"
            key={name}
            onClick={() => setUsername(name)}
            className={`rounded-2xl px-3 py-3 capitalize ${username === name ? "bg-sree text-white" : "bg-cream"}`}
          >
            {name}
          </button>
        ))}
      </div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full rounded-2xl bg-cream px-4 py-3 outline-none"
      />
      {error && <p className="text-sm text-sree">{error}</p>}
      <button className="w-full rounded-full bg-ink py-3 text-white">Come in</button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
