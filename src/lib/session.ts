import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.username) {
    throw new Error("You need to log in first.");
  }
  return session.user;
}

export async function getOptionalUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
