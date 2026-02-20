import type { ClothingCategory, StyleKey, SampleDesign } from "../types";
import { STYLE_GARMENT_MAP, STYLE_NAMES } from "../constants";

const STYLE_DESCRIPTIONS: Record<StyleKey, string> = {
  bejeweled: "Hand-sewn freshwater pearls and jeweled accents for a luxurious, couture finish.",
  embroidered: "Intricate hand-embroidered motifs with rich, colorful threadwork patterns.",
  wearable_art: "Bold hand-painted artistic designs — abstract, figurative, or pop art on denim.",
  dazzle: "Rhinestones, crystals, and sparkling stones creating glamorous, eye-catching patterns.",
  botanical: "Nature-inspired florals, leaf motifs, and garden-themed embellishments.",
  half_half: "Striking two-tone treatment with contrasting denim panels and color-blocking.",
  patches: "Eclectic mix of decorative patches, appliques, and mixed-media fabric collage.",
  couture_jewels: "Premium multi-technique showpiece combining pearls, rhinestones, and hand-painting.",
};

const STYLE_IMAGES: Record<StyleKey, string> = {
  bejeweled: "/samples/bejeweled.jpg",
  embroidered: "/samples/embroidered.jpg",
  wearable_art: "/samples/wearable_art.jpg",
  dazzle: "/samples/dazzle.jpg",
  botanical: "/samples/botanical.jpg",
  half_half: "/samples/half_half.jpg",
  patches: "/samples/patches.jpg",
  couture_jewels: "/samples/couture_jewels.jpg",
};

export function getSamplesForCategory(category: ClothingCategory): SampleDesign[] {
  const availableStyles = STYLE_GARMENT_MAP[category];
  return availableStyles.map((styleKey) => ({
    key: styleKey,
    name: STYLE_NAMES[styleKey],
    description: STYLE_DESCRIPTIONS[styleKey],
    imageUrl: STYLE_IMAGES[styleKey],
  }));
}
