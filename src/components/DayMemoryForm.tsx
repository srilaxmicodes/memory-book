"use client";

import { saveDayMemory } from "@/actions/journal";
import { MOODS } from "@/lib/constants";
import { useState } from "react";
import { useToast } from "./ToastProvider";

export function DayMemoryForm({
  dateKey,
  highlight,
  mood,
  moodEmoji,
}: {
  dateKey: string;
  highlight?: string;
  mood?: string;
  moodEmoji?: string;
}) {
  const { showToast } = useToast();
  const [picked, setPicked] = useState(moodEmoji || "");
  const selected = MOODS.find((item) => item.emoji === picked);

  async function submit(formData: FormData) {
    showToast("Saving today's memory...", "loading");
    try {
      await saveDayMemory(formData);
      showToast("Today's memory saved.");
    } catch {
      showToast("Today's memory could not be saved.", "error");
    }
  }

  return (
    <form action={submit} className="space-y-4 rounded-3xl bg-white p-6 shadow-card">
      <input type="hidden" name="dateKey" value={dateKey} />
      <input type="hidden" name="mood" value={selected?.label || mood || ""} />
      <input type="hidden" name="moodEmoji" value={picked} />
      <h2 className="font-display text-3xl">Highlight of the day ✨</h2>
      <p className="text-sm text-muted">How do we describe this day? 💗 Both of you can edit this.</p>
      <textarea
        name="highlight"
        defaultValue={highlight}
        rows={5}
        placeholder="Today was honestly so much fun..."
        className="w-full rounded-2xl bg-cream px-4 py-3 outline-none"
      />
      <div>
        <p className="mb-2 text-sm font-medium">Mood of the day</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => setPicked(item.emoji)}
              className={`rounded-full px-3 py-2 text-sm ${
                picked === item.emoji ? "bg-sree text-white" : "bg-cream"
              }`}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </div>
      </div>
      <button className="rounded-full bg-sree px-5 py-2 text-white">Save today’s memory</button>
    </form>
  );
}
