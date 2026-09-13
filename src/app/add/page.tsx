"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { MovieForm } from "@/components/MovieForm";
import { SimpleEntryForm } from "@/components/SimpleEntryForm";
import { CATEGORIES, todayKey } from "@/lib/constants";

function AddInner() {
  const params = useSearchParams();
  const [dateKey, setDateKey] = useState(params.get("date") || todayKey());
  const [category, setCategory] = useState(params.get("category") || "");

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <h1 className="font-display text-5xl">Add a memory</h1>
        <label className="block">
          <span className="mb-2 block text-sm">Date</span>
          <input
            type="date"
            value={dateKey}
            onChange={(e) => setDateKey(e.target.value)}
            className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none"
          />
        </label>
        <div>
          <p className="mb-3">What are we adding today?</p>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((item) => (
              <button
                key={item.value}
                onClick={() => setCategory(item.value)}
                className={`rounded-3xl px-4 py-6 text-left shadow-card ${
                  category === item.value ? "bg-sree text-white" : "bg-white"
                }`}
              >
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-medium">{item.label}</div>
              </button>
            ))}
          </div>
        </div>
        {category === "MOVIE" && <MovieForm dateKey={dateKey} />}
        {category === "FOOD" && <SimpleEntryForm dateKey={dateKey} category="FOOD" />}
        {category === "PLACE" && <SimpleEntryForm dateKey={dateKey} category="PLACE" />}
        {category === "OTHER" && <SimpleEntryForm dateKey={dateKey} category="OTHER" />}
      </main>
    </>
  );
}

export default function AddPage() {
  return (
    <Suspense>
      <AddInner />
    </Suspense>
  );
}
