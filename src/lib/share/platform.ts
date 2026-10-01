import type { Platform } from "./types";

export function detectPlatform(url: string): Platform {
  const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");

  if (hostname.endsWith("instagram.com")) return "instagram";
  if (hostname.endsWith("tiktok.com")) return "tiktok";
  if (hostname.endsWith("youtube.com") || hostname === "youtu.be") {
    return "youtube";
  }
  if (hostname.endsWith("x.com") || hostname.endsWith("twitter.com")) {
    return "x";
  }
  if (hostname.endsWith("linkedin.com")) return "linkedin";

  return "other";
}
