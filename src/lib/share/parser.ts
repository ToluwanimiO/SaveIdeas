import { detectPlatform } from "./platform";
import type { SharedContent } from "./types";

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function parseSharedText(value?: string): SharedContent | null {
  const candidate = value?.trim();

  if (!candidate || !isValidUrl(candidate)) {
    return null;
  }

  return {
    url: candidate,
    platform: detectPlatform(candidate),
  };
}
