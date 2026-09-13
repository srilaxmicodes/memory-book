"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { saveUpload } from "@/lib/storage";

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseOptionalRating(value: FormDataEntryValue | null) {
  const rating = parseOptionalNumber(value);
  return rating === null ? null : Math.max(0, Math.min(10, rating));
}

function parseNumber(value: FormDataEntryValue | null) {
  return parseOptionalNumber(value) ?? 0;
}

async function saveEntryUploads(formData: FormData, entryId: string, uploadedById: string) {
  const files = formData.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  for (const file of files) {
    const stored = await saveUpload(file);
    await prisma.media.create({
      data: {
        ...stored,
        uploadedById,
        entryId,
      },
    });
  }
}

export async function createEntry(formData: FormData) {
  const user = await requireUser();
  const category = String(formData.get("category") || "OTHER");
  const dateKey = String(formData.get("dateKey") || "");
  const title = String(formData.get("title") || "").trim();
  if (!dateKey || !title) {
    return { error: "Date and title are required." };
  }

  const sreeRating = parseOptionalRating(formData.get("sreeRating"));
  const dhanushRating = parseOptionalRating(formData.get("dhanushRating"));

  const entry = await prisma.entry.create({
    data: {
      category,
      dateKey,
      title,
      cost: parseNumber(formData.get("cost")),
      worthIt: String(formData.get("worthIt") || "") || null,
      notes: String(formData.get("notes") || ""),
      createdById: user.id,
      createdByName: user.displayName,
      posterUrl: String(formData.get("posterUrl") || "") || null,
      backdropUrl: String(formData.get("backdropUrl") || "") || null,
      releaseDate: String(formData.get("releaseDate") || "") || null,
      genres: String(formData.get("genres") || "") || null,
      overview: String(formData.get("overview") || "") || null,
      tmdbId: String(formData.get("tmdbId") || "") || null,
      imdbId: String(formData.get("imdbId") || "") || null,
      imdbRating: String(formData.get("imdbRating") || "") || null,
      restaurant: String(formData.get("restaurant") || "") || null,
      location: String(formData.get("location") || "") || null,
      description: String(formData.get("description") || "") || null,
      sreeRating,
      sreeReview: String(formData.get("sreeReview") || ""),
      dhanushRating,
      dhanushReview: String(formData.get("dhanushReview") || ""),
    },
  });

  await saveEntryUploads(formData, entry.id, user.id);

  revalidatePath("/home");
  revalidatePath("/memories");
  revalidatePath(`/day/${dateKey}`);
  revalidatePath("/stats");
  return { id: entry.id };
}

export async function updateEntry(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const entry = await prisma.entry.findUnique({ where: { id } });
  if (!entry) return;

  const data: Record<string, unknown> = {
    title: String(formData.get("title") || entry.title),
    cost: parseNumber(formData.get("cost")),
    worthIt: String(formData.get("worthIt") || "") || null,
    notes: String(formData.get("notes") || ""),
    restaurant: String(formData.get("restaurant") || "") || null,
    location: String(formData.get("location") || "") || null,
    description: String(formData.get("description") || "") || null,
    dateKey: String(formData.get("dateKey") || entry.dateKey),
    sreeRating: parseOptionalRating(formData.get("sreeRating")),
    sreeReview: String(formData.get("sreeReview") || ""),
    dhanushRating: parseOptionalRating(formData.get("dhanushRating")),
    dhanushReview: String(formData.get("dhanushReview") || ""),
  };

  await prisma.entry.update({ where: { id }, data });
  await saveEntryUploads(formData, id, user.id);
  revalidatePath(`/entry/${id}`);
  revalidatePath("/home");
  revalidatePath("/memories");
  revalidatePath("/stats");
}

export async function toggleFavorite(entryId: string) {
  await requireUser();
  const entry = await prisma.entry.findUnique({ where: { id: entryId } });
  if (!entry) return;
  const nextFavorite = !(entry.favoriteSree || entry.favoriteDhanush);
  await prisma.entry.update({
    where: { id: entryId },
    data: { favoriteSree: nextFavorite, favoriteDhanush: nextFavorite },
  });
  revalidatePath("/favorites");
  revalidatePath(`/entry/${entryId}`);
  revalidatePath("/home");
}

export async function addFoodItem(formData: FormData) {
  await requireUser();
  const entryId = String(formData.get("entryId") || "");
  const name = String(formData.get("name") || "").trim();
  if (!entryId || !name) return;
  const item = await prisma.foodItem.create({
    data: {
      entryId,
      name,
      cost: parseNumber(formData.get("cost")),
      worthIt: String(formData.get("worthIt") || "") || null,
      notes: String(formData.get("notes") || ""),
      sreeRating: parseOptionalRating(formData.get("sreeRating")),
      sreeReview: String(formData.get("sreeReview") || ""),
      dhanushRating: parseOptionalRating(formData.get("dhanushRating")),
      dhanushReview: String(formData.get("dhanushReview") || ""),
    },
  });
  const entry = await prisma.entry.findUnique({
    where: { id: entryId },
    include: { foodItems: true },
  });
  if (entry) {
    const total = entry.foodItems.reduce((sum, food) => sum + food.cost, 0);
    await prisma.entry.update({ where: { id: entryId }, data: { cost: total } });
  }
  revalidatePath(`/entry/${entryId}`);
}

export async function updateFoodItem(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") || "");
  const item = await prisma.foodItem.findUnique({ where: { id } });
  if (!item) return;
  const data: Record<string, unknown> = {
    name: String(formData.get("name") || item.name),
    cost: parseNumber(formData.get("cost")),
    worthIt: String(formData.get("worthIt") || "") || null,
    notes: String(formData.get("notes") || ""),
    sreeRating: parseOptionalRating(formData.get("sreeRating")),
    sreeReview: String(formData.get("sreeReview") || ""),
    dhanushRating: parseOptionalRating(formData.get("dhanushRating")),
    dhanushReview: String(formData.get("dhanushReview") || ""),
  };
  await prisma.foodItem.update({ where: { id }, data });
  const entry = await prisma.entry.findUnique({
    where: { id: item.entryId },
    include: { foodItems: true },
  });
  if (entry) {
    const total = entry.foodItems.reduce((sum, food) => sum + food.cost, 0);
    await prisma.entry.update({ where: { id: entry.id }, data: { cost: total } });
  }
  revalidatePath(`/entry/${item.entryId}`);
}

export async function saveDayMemory(formData: FormData) {
  const user = await requireUser();
  const dateKey = String(formData.get("dateKey") || "");
  if (!dateKey) return;
  await prisma.dayMemory.upsert({
    where: { dateKey },
    update: {
      highlight: String(formData.get("highlight") || ""),
      mood: String(formData.get("mood") || ""),
      moodEmoji: String(formData.get("moodEmoji") || ""),
      updatedBy: user.displayName,
    },
    create: {
      dateKey,
      highlight: String(formData.get("highlight") || ""),
      mood: String(formData.get("mood") || ""),
      moodEmoji: String(formData.get("moodEmoji") || ""),
      updatedBy: user.displayName,
    },
  });
  revalidatePath(`/day/${dateKey}`);
  revalidatePath("/home");
}
