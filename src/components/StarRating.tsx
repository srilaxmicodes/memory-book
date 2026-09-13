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
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className={`flex ${colorClass}`}>
        {stars.map((star) => {
          const full = current >= star;
          const half = !full && current >= star - 0.5;
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => onChange?.(current === star ? star - 0.5 : star)}
              className="relative h-7 w-7 text-xl leading-none disabled:cursor-default"
              aria-label={`${star} stars`}
            >
              <span className="text-blush">★</span>
              {(full || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: half ? "50%" : "100%" }}
                >
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>
      <span className="text-sm text-muted">{current ? `${current}/5` : "Not rated yet"}</span>
    </div>
  );
}
