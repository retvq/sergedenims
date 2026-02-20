import type { ClothingCategory, StyleKey } from "../types";

export const DETECTION_PROMPT = `You are a fashion AI assistant for Serge De Nimes, a premium denim customization brand.

Analyze this clothing image and identify the garment type.

Respond in JSON format only:
{
  "category": "jacket" | "shirt" | "vest" | "crop_top" | "dress" | "hoodie",
  "confidence": "high" | "medium" | "low",
  "description": "A detailed description of the garment including color, wash, material, current condition, and any existing design elements"
}

Rules:
- Only identify DENIM garments. If the item is not denim, set confidence to "low" and pick the closest matching category.
- "crop_top" includes bustiers and cropped tops.
- ONLY describe the garment itself. Do NOT mention any person. Focus on: color, wash, fabric, stitching, buttons, pockets, collar style, condition.
- Be detailed — this description will be used for design generation.`;

const STYLE_PROMPTS: Record<StyleKey, string> = {
  bejeweled: `Add small freshwater pearls along the collar edge, pocket flaps, and shoulder seams. Mixed sizes, white and cream. Sewn on with visible thread. Subtle lace accent on the back. Feminine and refined, not heavy coverage.`,

  embroidered: `Add colorful embroidery to the front of the garment: a floral motif on the chest pocket area and decorative threadwork along the collar and cuffs. Use gold and red thread. Raised satin-stitch with visible texture. Keep 85% of the denim clean.`,

  wearable_art: `Add a bold hand-painted design on the front chest and pocket area — a colorful abstract or floral composition using vivid purples, blues, and golds. Visible brushstrokes on the denim texture. The painted area is contained to about 30% of the visible surface. Rest is clean denim.`,

  dazzle: `Add small clear rhinestones in thin vertical pinstripe lines running down the front of the garment. The rhinestones follow the garment's structure — along seams, pocket edges, and button placket. Sparkling but restrained. 80% of denim stays clean.`,

  botanical: `Add embroidered flowers and vines on the left chest area — dusty pink roses, sage green leaves, cream accents. The floral arrangement trails from the shoulder toward the pocket. Satin-stitch flowers with stem-stitch vines. Contained to one side, 75% of denim stays clean.`,

  half_half: `Change the bottom half of the garment to a contrasting denim wash — if the original is light, make the bottom dark indigo; if dark, make it off-white. Clean horizontal division at the waist. Contrasting stitching at the join. No other changes — same buttons, pockets, hardware.`,

  patches: `Add 4-5 sewn-on patches to the front: a mix of embroidered badges, vintage logo patches, and typography patches on the chest, pockets, and lower panels. Each patch is different. Visible stitching around edges. Spread out with space between them. 70% of denim visible.`,

  couture_jewels: `Add one elaborate decorative patch on the front chest — a jeweled crest combining velvet fabric, gold thread, small rhinestones, and pearl accents. About 12cm in size. The rest of the garment stays completely clean denim. One statement piece, pristine denim everywhere else.`,
};

export function getStylePrompt(styleKey: StyleKey): string {
  return STYLE_PROMPTS[styleKey];
}

export function buildSamplePrompt(
  garmentType: ClothingCategory,
  clothingDescription: string,
  styleKey: StyleKey
): string {
  return `Edit this denim ${garmentType.replace("_", " ")} to add customization. Keep the exact same garment — same view, same angle, same color, same buttons, same pockets. Only add the embellishments described below. Show it as a product photo on white background.

${STYLE_PROMPTS[styleKey]}`;
}

export function buildCustomPrompt(
  garmentType: ClothingCategory,
  clothingDescription: string,
  userInstructions: string,
  hasDesignImage: boolean
): string {
  return `Edit this denim ${garmentType.replace("_", " ")} to add customization. Keep the exact same garment — same view, same angle, same color, same buttons, same pockets. Only add what the customer asks for. Show it as a product photo on white background.

Customer request: "${userInstructions}"
${
  hasDesignImage
    ? `\nThe second image is a design reference — apply it to the garment based on the customer's instructions.`
    : ""
}`;
}

export function appendRegenerationFeedback(
  basePrompt: string,
  feedback: string | null | undefined
): string {
  if (!feedback || feedback.trim().length === 0) return basePrompt;
  return `${basePrompt}

The last image is the previous generated design. The customer reviewed it and wants these changes: ${feedback.trim()}`;
}
