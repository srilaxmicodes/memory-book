export const dynamic = "force-dynamic";

import Link from "next/link";
import { getOptionalUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { WELCOME_MESSAGES } from "@/lib/constants";

export default async function LandingPage() {
  const user = await getOptionalUser();
  if (user) redirect("/home");
  const message = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];

  return (
    <main className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center overflow-hidden px-6 text-center">
      <span className="sparkle left-[12%] top-[18%]" />
      <span className="sparkle right-[16%] top-[28%] [animation-delay:700ms]" />
      <span className="sparkle left-[20%] bottom-[22%] [animation-delay:1.2s]" />
      <span className="heart-bg left-[8%] top-[30%] text-5xl">💗</span>
      <span className="heart-bg right-[10%] bottom-[28%] text-4xl [animation-delay:1.4s]">✨</span>
      <p className="animate-fadeUp text-sm tracking-[0.3em] text-muted">SREE & DHANUSH</p>
      <h1 className="animate-fadeUp mt-4 font-display text-5xl leading-tight sm:text-7xl">{message}</h1>
      <p className="animate-fadeUp mt-6 max-w-lg text-muted">
        Your private book for movies, meals, places, and the little days you never want to lose.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/login" className="rounded-full bg-sree px-7 py-3 text-white shadow-soft">
          Enter our world
        </Link>
        <Link href="/login" className="rounded-full bg-white px-7 py-3 text-ink shadow-card">
          Log in
        </Link>
      </div>
    </main>
  );
}
