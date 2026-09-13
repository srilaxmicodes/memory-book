import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((item): item is File => item instanceof File);
  const entryId = String(form.get("entryId") || "") || null;
  const foodItemId = String(form.get("foodItemId") || "") || null;
  const dateKey = String(form.get("dateKey") || "") || null;

  let dayMemoryId: string | null = null;
  if (dateKey) {
    const day = await prisma.dayMemory.upsert({
      where: { dateKey },
      update: {},
      create: { dateKey, updatedBy: session.user.displayName },
    });
    dayMemoryId = day.id;
  }

  const saved = [];
  for (const file of files) {
    if (!file.size) continue;
    const stored = await saveUpload(file);
    const media = await prisma.media.create({
      data: {
        ...stored,
        uploadedById: session.user.id,
        entryId,
        foodItemId,
        dayMemoryId,
      },
    });
    saved.push(media);
  }

  return NextResponse.json({ media: saved });
}
