"use client";

import { deleteOwnMedia } from "@/actions/media";
import { useSession } from "next-auth/react";
import { useToast } from "./ToastProvider";

type Media = {
  id: string;
  url: string;
  kind: string;
  uploadedById: string;
};

export function MediaGallery({ media }: { media: Media[] }) {
  const { data } = useSession();
  const { showToast } = useToast();
  if (!media.length) {
    return <p className="text-sm text-muted">No photos or videos yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {media.map((item) => (
        <figure key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-card">
          {item.kind === "video" ? (
            <video src={item.url} controls className="h-48 w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.url} alt="" className="h-48 w-full object-cover" />
          )}
          {data?.user?.id === item.uploadedById && (
            <form
              action={async () => {
                showToast("Deleting upload...", "loading");
                try {
                  await deleteOwnMedia(item.id);
                  showToast("Upload deleted.");
                } catch {
                  showToast("Upload could not be deleted.", "error");
                }
              }}
              className="p-2 text-right"
            >
              <button className="text-xs text-muted hover:text-sree">Delete my upload</button>
            </form>
          )}
        </figure>
      ))}
    </div>
  );
}
