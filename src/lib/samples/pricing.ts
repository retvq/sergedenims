import type { ClothingCategory, StyleKey } from "../types";

const STYLE_BASE_PRICE: Record<StyleKey | "custom", number> = {
  half_half: 125,
  patches: 150,
  embroidered: 175,
  botanical: 175,
  dazzle: 225,
  wearable_art: 250,
  bejeweled: 275,
  couture_jewels: 350,
  custom: 300,
};

const GARMENT_MODIFIER: Record<ClothingCategory, number> = {
  jacket: 25,
  dress: 15,
  hoodie: 10,
  shirt: 5,
  vest: 0,
  crop_top: -10,
};

export function getPrice(
  styleKey: StyleKey | "custom",
  garmentType: ClothingCategory
): number {
  return STYLE_BASE_PRICE[styleKey] + GARMENT_MODIFIER[garmentType];
}

export function getPricingLabel(styleKey: StyleKey | "custom"): string {
  const labels: Record<StyleKey | "custom", string> = {
    bejeweled: "Bejeweled with Pearls",
    embroidered: "Embroidered",
    wearable_art: "Wearable Art",
    dazzle: "Dazzle It Up",
    botanical: "Botanical Garden",
    half_half: "Half & Half",
    patches: "Patches",
    couture_jewels: "Couture Jewels",
    custom: "Custom Design",
  };
  return labels[styleKey];
}
