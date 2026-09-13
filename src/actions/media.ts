"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { deleteUpload } from "@/lib/storage";

export async function deleteOwnMedia(mediaId: string) {
  const user = await requireUser();
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) return { error: "Media not found." };
  if (media.uploadedById !== user.id) {
    return { error: "You can only delete files you uploaded." };
  }
  await deleteUpload(media.storageKey);
  await prisma.media.delete({ where: { id: mediaId } });
  if (media.entryId) revalidatePath(`/entry/${media.entryId}`);
  if (media.dayMemoryId) {
    const day = await prisma.dayMemory.findUnique({ where: { id: media.dayMemoryId } });
    if (day) revalidatePath(`/day/${day.dateKey}`);
  }
  return { ok: true };
}
