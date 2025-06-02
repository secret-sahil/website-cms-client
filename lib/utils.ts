import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
import { env } from "@/env.mjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decrypt(data?: string) {
  if (!data) {
    return data;
  }
  const [ivHex, encryptedText] = data.split(":");
  const ivBuffer = Buffer.from(ivHex, "hex");
  const key = crypto
    .createHash("sha256")
    .update(String(env.NEXT_PUBLIC_DATA_ENCRYPTION_KEY))
    .digest("base64")
    .substr(0, 32);

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivBuffer);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
