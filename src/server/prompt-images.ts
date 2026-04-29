import "server-only";

import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";

const PROMPT_IMAGE_DIR = path.join(process.cwd(), "public", "prompt_images");
const PROMPT_IMAGE_URL_PREFIX = "/prompt_images/";

const MIME_TYPE_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function sanitizeExtension(fileName: string, mimeType: string) {
  const mimeExtension = MIME_TYPE_TO_EXTENSION[mimeType];

  if (mimeExtension) {
    return mimeExtension;
  }

  const rawExtension = path.extname(fileName).replace(".", "").toLowerCase();
  return rawExtension || "bin";
}

export async function savePromptImage(input: {
  fileName: string;
  mimeType: string;
  dataBase64: string;
  userId: string;
}) {
  await mkdir(PROMPT_IMAGE_DIR, { recursive: true });

  const extension = sanitizeExtension(input.fileName, input.mimeType);
  const fileName = `${input.userId}-${crypto.randomUUID()}.${extension}`;
  const filePath = path.join(PROMPT_IMAGE_DIR, fileName);

  await writeFile(filePath, Buffer.from(input.dataBase64, "base64"));

  return `${PROMPT_IMAGE_URL_PREFIX}${fileName}`;
}

export async function deletePromptImage(imageUrl?: string | null) {
  if (!imageUrl?.startsWith(PROMPT_IMAGE_URL_PREFIX)) {
    return;
  }

  const fileName = imageUrl.slice(PROMPT_IMAGE_URL_PREFIX.length);

  if (!fileName) {
    return;
  }

  await rm(path.join(PROMPT_IMAGE_DIR, fileName), { force: true });
}
