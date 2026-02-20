import type { ClothingCategory, StyleKey } from "./types";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_GENERATIONS = 5;
export const MAX_CUSTOM_INSTRUCTIONS_LENGTH = 500;
export const MIN_CUSTOM_INSTRUCTIONS_LENGTH = 10;
export const MIN_REGENERATION_FEEDBACK = 20;
export const MAX_REGENERATION_FEEDBACK = 500;

export const ACCEPTED_IMAGE_TYPES: Record<string, string[]> = {
  "image/*": [".png", ".jpg", ".jpeg", ".webp"],
};

export const CLOTHING_CATEGORIES: Record<ClothingCategory, string> = {
  jacket: "Jacket",
  shirt: "Shirt",
  vest: "Vest",
  crop_top: "Crop Top",
  dress: "Dress",
  hoodie: "Hoodie",
};

export const STYLE_NAMES: Record<StyleKey, string> = {
  bejeweled: "Bejeweled with Pearls",
  embroidered: "Embroidered",
  wearable_art: "Wearable Art",
  dazzle: "Dazzle It Up",
  botanical: "Botanical Garden",
  half_half: "Half & Half",
  patches: "Patches",
  couture_jewels: "Couture Jewels",
};

// Which styles are available for each garment type
export const STYLE_GARMENT_MAP: Record<ClothingCategory, StyleKey[]> = {
  jacket: ["bejeweled", "embroidered", "wearable_art", "dazzle", "half_half", "patches", "couture_jewels"],
  shirt: ["wearable_art", "dazzle", "half_half", "couture_jewels"],
  vest: ["embroidered", "dazzle", "botanical", "half_half", "patches"],
  crop_top: ["embroidered", "wearable_art", "dazzle", "couture_jewels"],
  dress: ["embroidered", "wearable_art", "dazzle", "botanical"],
  hoodie: ["embroidered", "wearable_art", "dazzle", "patches"],
};
