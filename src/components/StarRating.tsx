"use client";

export function StarRating({
  value,
  onChange,
  readOnly,
  colorClass = "text-amber-400",
}: {
  value?: number | null;
  onChange?: (next: number) => void;
  readOnly?: boolean;
  colorClass?: string;
}) {
  const current = value ?? 0;
  const ratings = Array.from({ length: 10 }, (_, index) => index + 1);
  const selectedClass = colorClass === "text-dhanush" ? "bg-dhanush" : colorClass === "text-sree" ? "bg-sree" : "bg-rose";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className={`flex flex-wrap gap-1 ${colorClass}`}>
        {ratings.map((rating) => {
          const selected = current === rating;
          return (
            <button
              key={rating}
              type="button"
              disabled={readOnly}
              onClick={() => onChange?.(current === rating ? 0 : rating)}
              className={`h-8 w-8 rounded-full text-sm font-medium transition disabled:cursor-default ${
                selected ? `${selectedClass} text-white shadow-card` : "bg-blush text-ink hover:bg-white"
              }`}
              aria-label={`${rating} out of 10`}
            >
              <span>{rating}</span>
            </button>
          );
        })}
      </div>
      <span className="text-sm text-muted">{current ? `${current}/10` : "Not rated yet"}</span>
    </div>
  );
}
