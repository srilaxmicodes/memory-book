"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";

export function RatingField({
  name,
  label,
  defaultValue,
  colorClass,
}: {
  name: string;
  label: string;
  defaultValue?: number | null;
  colorClass?: string;
}) {
  const [value, setValue] = useState<number>(defaultValue ?? 0);
  return (
    <div>
      <p className="mb-1 text-sm font-medium">{label}</p>
      <input type="hidden" name={name} value={value || ""} />
      <StarRating value={value} onChange={setValue} colorClass={colorClass} />
    </div>
  );
}
