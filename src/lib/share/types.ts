export type Platform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "x"
  | "linkedin"
  | "other";

export interface SharedContent {
  url: string;
  platform: Platform;
}
