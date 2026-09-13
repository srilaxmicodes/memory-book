import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

function useCloudinary() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function saveUpload(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const kind = file.type.startsWith("video/") ? "video" : "photo";
  const ext = path.extname(file.name) || (kind === "video" ? ".mp4" : ".jpg");
  const key = `${randomUUID()}${ext}`;

  if (useCloudinary()) {
    configureCloudinary();
    const uploaded = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "memory-book",
              resource_type: kind === "video" ? "video" : "image",
              public_id: key.replace(ext, ""),
            },
            (error, result) => {
              if (error || !result) reject(error);
              else resolve({ secure_url: result.secure_url, public_id: result.public_id });
            }
          )
          .end(bytes);
      }
    );
    return {
      url: uploaded.secure_url,
      storageKey: `cloudinary:${uploaded.public_id}`,
      kind,
      mimeType: file.type || "application/octet-stream",
    };
  }

  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, key), bytes);
  return {
    url: `/uploads/${key}`,
    storageKey: `local:${key}`,
    kind,
    mimeType: file.type || "application/octet-stream",
  };
}

export async function deleteUpload(storageKey: string) {
  if (storageKey.startsWith("cloudinary:")) {
    if (!useCloudinary()) return;
    configureCloudinary();
    const publicId = storageKey.replace("cloudinary:", "");
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" }).catch(async () => {
      await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    });
    return;
  }
  if (storageKey.startsWith("local:")) {
    const filename = storageKey.replace("local:", "");
    await unlink(path.join(uploadsDir, filename)).catch(() => undefined);
  }
}
