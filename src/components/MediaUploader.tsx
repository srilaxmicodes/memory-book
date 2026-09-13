"use client";

import { useState } from "react";

export function MediaUploader({
  entryId,
  foodItemId,
  dateKey,
}: {
  entryId?: string;
  foodItemId?: string;
  dateKey?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;
    setBusy(true);
    setMessage("");
    const body = new FormData();
    Array.from(files).forEach((file) => body.append("files", file));
    if (entryId) body.set("entryId", entryId);
    if (foodItemId) body.set("foodItemId", foodItemId);
    if (dateKey) body.set("dateKey", dateKey);
    const res = await fetch("/api/upload", { method: "POST", body });
    setBusy(false);
    if (!res.ok) {
      setMessage("Upload failed. Try a smaller file.");
      return;
    }
    window.location.reload();
  }

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-rose/50 bg-white/70 px-4 py-8 text-center">
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        className="sr-only"
        onChange={onChange}
        disabled={busy}
      />
      <span className="text-2xl">📷🎥</span>
      <span className="mt-2 font-medium">{busy ? "Uploading…" : "Add photos & videos"}</span>
      <span className="mt-1 text-sm text-muted">They stay saved with this memory.</span>
      {message && <span className="mt-2 text-sm text-sree">{message}</span>}
    </label>
  );
}
