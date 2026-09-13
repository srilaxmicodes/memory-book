import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-5xl">This page wandered off 🌸</h1>
      <p className="mt-3 text-muted">Let’s go back to your memory book.</p>
      <Link href="/home" className="mt-6 rounded-full bg-sree px-5 py-2 text-white">
        Home
      </Link>
    </main>
  );
}
