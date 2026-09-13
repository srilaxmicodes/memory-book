export const WELCOME_MESSAGES = [
  "Welcome Cuties 💗",
  "Hey you two! ✨",
  "Welcome back, favorite humans 🫶",
  "Another memory to keep? 🌷",
  "Hi Sree & Dhanush 💕",
  "What are we rating today? 👀",
  "Another day, another memory ✨",
  "Welcome to your little world 💗",
  "Let's save today's memory 🥹",
  "Back to your memory book 🌸",
];

export const WORTH_IT = [
  { value: "ABSOLUTELY", label: "Absolutely", emoji: "❤️" },
  { value: "YES", label: "Yes", emoji: "😊" },
  { value: "MAYBE", label: "Maybe", emoji: "😐" },
  { value: "NO", label: "No", emoji: "😭" },
] as const;

export const MOODS = [
  { emoji: "🥰", label: "Happy" },
  { emoji: "😍", label: "In love" },
  { emoji: "😌", label: "Peaceful" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "😂", label: "Silly" },
  { emoji: "😴", label: "Sleepy" },
  { emoji: "🥲", label: "Bittersweet" },
  { emoji: "🤗", label: "Cozy" },
];

export const CATEGORIES = [
  { value: "MOVIE", label: "Movie", emoji: "🎬" },
  { value: "FOOD", label: "Food", emoji: "🍔" },
  { value: "PLACE", label: "Place", emoji: "📍" },
  { value: "OTHER", label: "Other", emoji: "✨" },
] as const;

export type Category = (typeof CATEGORIES)[number]["value"];
export type WorthItValue = (typeof WORTH_IT)[number]["value"];

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDate(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatRupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function categoryMeta(category: string) {
  return CATEGORIES.find((item) => item.value === category) ?? CATEGORIES[3];
}

export function worthItMeta(value?: string | null) {
  return WORTH_IT.find((item) => item.value === value) ?? null;
}

export function averageRating(a?: number | null, b?: number | null) {
  const values = [a, b].filter((n): n is number => typeof n === "number");
  if (!values.length) return null;
  return Math.round((values.reduce((sum, n) => sum + n, 0) / values.length) * 100) / 100;
}

export function isSree(username?: string | null) {
  return username === "sree";
}

export function monthRange(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const last = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
  return { start, end };
}
