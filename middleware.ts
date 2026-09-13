import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const protectedPrefixes = [
  "/home",
  "/add",
  "/entry",
  "/day",
  "/timeline",
  "/search",
  "/favorites",
  "/stats",
  "/memories",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!needsAuth) return NextResponse.next();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/add/:path*",
    "/entry/:path*",
    "/day/:path*",
    "/timeline/:path*",
    "/search/:path*",
    "/favorites/:path*",
    "/stats/:path*",
    "/memories/:path*",
  ],
};
