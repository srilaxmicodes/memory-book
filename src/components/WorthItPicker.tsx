"use client";

import { WORTH_IT } from "@/lib/constants";

export function WorthItPicker({
  name = "worthIt",
  defaultValue,
}: {
  name?: string;
  defaultValue?: string | null;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Was it worth it?</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {WORTH_IT.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-3 py-3 text-sm shadow-card has-[:checked]:ring-2 has-[:checked]:ring-sree"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={defaultValue === option.value}
              className="sr-only"
            />
            <span>
              {option.emoji} {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
