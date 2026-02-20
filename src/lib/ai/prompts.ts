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
- "dress" includes two-piece sets, co-ord sets, matching shirt-and-shorts combos, matching shirt-and-pants combos, jumpsuits, rompers, and any multi-piece denim outfit shown together.
- ONLY describe the garment itself. Do NOT mention any person. Focus on: color, wash, fabric, stitching, buttons, pockets, collar style, condition.
- Be detailed — this description will be used for design generation.`;

const STYLE_PROMPTS: Record<StyleKey, string> = {
  bejeweled: `Style: Bejeweled with Pearls. Adorn this garment with freshwater pearls and jeweled accents. Be creative with placement — choose unexpected areas like one shoulder cascade, a pearl wave across the back, clustered constellations on one panel, or an asymmetric trail from collar to hem. Mix pearl sizes and tones (white, cream, blush, grey). Combine with lace, tiny crystals, or metallic thread accents. Each design should feel unique and luxurious. Keep 60-80% of denim visible.`,

  embroidered: `Style: Embroidered. Add hand-embroidered artwork to this garment. Be creative with the design — choose from: floral bouquets, geometric tribal patterns, animal motifs (birds, butterflies, koi fish), celestial designs (moons, stars), abstract swirls, or cultural-inspired patterns. Vary the placement: back panel, one sleeve, across the yoke, wrapping around a pocket, or trailing down one side. Use a unique color palette each time — jewel tones, earth tones, pastels, or bold primaries. Mix stitch types: satin, chain, French knots, couching. Keep 70-85% of denim clean.`,

  wearable_art: `Style: Wearable Art. Hand-paint a bold, original artwork directly onto the denim. Be wildly creative — choose from: abstract expressionism, surreal dreamscapes, ocean waves, galaxy/nebula scenes, pop art portraits, graffiti lettering, Japanese ink wash, impressionist flowers, geometric optical illusions, or street art murals. Vary the composition each time — paint could cover the entire back, wrap around one side, splash across the front asymmetrically, or frame a pocket. Use vivid, unexpected color combinations. Visible brushstrokes on denim texture. Paint covers 25-40% of the garment.`,

  dazzle: `Style: Dazzle It Up. Embellish with rhinestones, crystals, and sparkling stones in a creative pattern. Be inventive — choose from: scattered constellation effect, geometric chevron lines, a crystal gradient fading from dense to sparse, swirling galaxy pattern, crystal fringe along hems, a starburst radiating from one point, diamond-shaped lattice, or crystals tracing the garment's natural curves. Mix crystal sizes and types (clear, aurora borealis, colored stones). Each design should sparkle differently. Keep 70-85% of denim visible.`,

  botanical: `Style: Botanical Garden. Add nature-inspired embellishments — be creative with the specific botanicals: choose from wildflowers, tropical orchids, cherry blossoms, sunflowers, lavender sprigs, succulents, ferns and monstera leaves, climbing ivy, peonies, or dried flower arrangements. Vary placement: cascading down one arm, wrapping the collar, blooming from a pocket, climbing up the back, or a scattered meadow effect. Mix techniques — embroidered petals, painted leaves, appliqué flowers, beaded stamens. Use a fresh color palette each time. Contained to 25-40% of the garment.`,

  half_half: `Style: Half & Half. Create a striking two-tone or split denim treatment. Be creative with the division — choose from: vertical left-right split, diagonal slash, horizontal at waist, one sleeve contrasting, front-back contrast, or an irregular jagged/torn division line. For the contrast, pick from: light wash vs dark indigo, raw vs bleached, black vs blue, acid wash vs clean, distressed vs pristine, or color-dyed (rust, burgundy, forest green) vs natural denim. The division edge could be clean-cut, frayed, gradient-blended, zigzag-stitched, or chain-stitched. No other embellishments — purely a bold color-block construction piece.`,

  patches: `Style: Patches. Adorn with an eclectic collection of sewn-on patches and appliqués. Be creative with the patch themes — choose from: vintage travel badges, music and band-inspired, nature and wildlife, retro sports logos, maritime/nautical, space exploration, floral embroidered, typography and slogans, cultural symbols, or abstract art patches. Vary sizes (tiny pins to large back patches), shapes (circles, shields, diamonds, irregular), and attachment styles (visible contrast stitching, raw-edge, iron-on with topstitch). Place them in unexpected arrangements — not just the chest. Use 3-6 patches total. Keep 65-75% of denim visible.`,

  couture_jewels: `Style: Couture Jewels. Create one breathtaking focal piece on this garment — a couture-level jeweled statement. Be creative with what it is: an ornate brooch cluster, a jeweled epaulette on one shoulder, a beaded collar overlay, a crystal-and-pearl medallion, a gem-encrusted crest, a cascading jewel chain across the chest, or an elaborate beaded motif on the back. Combine materials: velvet, gold/silver thread, rhinestones, pearls, metallic beads, sequins, semi-precious stones. The piece should be 10-20cm and feel like wearable jewelry. The rest of the garment stays completely clean denim — one statement, pristine everywhere else.`,
};

export function getStylePrompt(styleKey: StyleKey): string {
  return STYLE_PROMPTS[styleKey];
}

export function buildSamplePrompt(
  garmentType: ClothingCategory,
  clothingDescription: string,
  styleKey: StyleKey
): string {
  // Add a random seed phrase so each generation produces a unique creative interpretation
  const variations = [
    "Create a fresh, never-before-seen interpretation.",
    "Surprise with an unexpected creative direction.",
    "Take a unique artistic approach different from any previous design.",
    "Push creative boundaries with an original composition.",
    "Design something one-of-a-kind and distinctive.",
    "Explore an unconventional take on this style.",
    "Craft a design that feels uniquely handmade and personal.",
    "Invent a bold new variation that stands out.",
  ];
  const seed = variations[Math.floor(Math.random() * variations.length)];

  return `The first image is the customer's actual denim ${garmentType.replace("_", " ")}. You MUST preserve this exact garment as the base — same color, same wash, same denim shade, same buttons, same pockets, same collar, same stitching, same silhouette, same angle, same lighting. Do NOT replace it with a different garment. Do NOT change the denim color or wash. The output must be clearly recognizable as the same piece of clothing from the input photo, with embellishments added on top.

Base garment to preserve: ${clothingDescription}

GARMENT PRESERVATION IS THE #1 PRIORITY. If the input is a black denim jacket, the output must be the same black denim jacket. If it is light wash, it stays light wash. The underlying garment must be identical — only the customization elements are new.

REALISM: This must look like a real photograph, not a digital rendering. Customizations should look handcrafted — visible thread texture, natural imperfections, real material depth. The denim weave and wear should remain photorealistic. Think: a premium e-commerce product photo, studio lighting.

${seed}

${STYLE_PROMPTS[styleKey]}`;
}

export function buildCustomPrompt(
  garmentType: ClothingCategory,
  clothingDescription: string,
  userInstructions: string,
  hasDesignImage: boolean
): string {
  return `The first image is the customer's actual denim ${garmentType.replace("_", " ")}. You MUST preserve this exact garment as the base — same color, same wash, same denim shade, same buttons, same pockets, same collar, same stitching, same silhouette, same angle, same lighting. Do NOT replace it with a different garment. Do NOT change the denim color or wash. The output must be clearly recognizable as the same piece of clothing from the input photo, with only the requested customization added on top.

Base garment to preserve: ${clothingDescription}

GARMENT PRESERVATION IS THE #1 PRIORITY. If the input is a black denim jacket, the output must be the same black denim jacket. If it is light wash, it stays light wash. The underlying garment must be identical — only the customization elements are new.

REALISM: This must look like a real photograph, not a digital rendering. Customizations should look handcrafted — visible thread texture, natural imperfections, real material depth. The denim weave and wear should remain photorealistic. Think: a premium e-commerce product photo, studio lighting.

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
