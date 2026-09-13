import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { searchMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const results = await searchMovies(q);
  return NextResponse.json({ results, enabled: Boolean(process.env.TMDB_API_KEY) });
}
