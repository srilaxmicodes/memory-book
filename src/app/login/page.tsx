"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useToast } from "@/components/ToastProvider";

const redirectAfterToast = (url: string) => {
  window.setTimeout(() => {
    window.location.href = url;
  }, 700);
};

function LoginForm() {
  const params = useSearchParams();
  const { showToast } = useToast();
  const [username] = useState("couple");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    showToast("Checking password...", "loading");
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: params.get("callbackUrl") || "/home",
      });
      if (result?.error) {
        setError("That password didn’t match. Try again, cutie.");
        showToast("Password did not match.", "error");
        return;
      }
      showToast("Logged in.");
      redirectAfterToast(params.get("callbackUrl") || "/home");
    } catch {
      setError("Login failed. Please try again.");
      showToast("Login failed. Please try again.", "error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-3xl bg-white/80 p-8 shadow-soft">
      <h1 className="font-display text-4xl">Couple login</h1>
      <p className="text-sm text-muted">One shared account for Sree and Dhanush.</p>
      <input type="hidden" name="username" value={username} />
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
