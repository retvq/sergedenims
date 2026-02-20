export type ClothingCategory = "jacket" | "shirt" | "vest" | "crop_top" | "dress" | "hoodie";
export type StyleKey =
  | "bejeweled"
  | "embroidered"
  | "wearable_art"
  | "dazzle"
  | "botanical"
  | "half_half"
  | "patches"
  | "couture_jewels";
export type PathType = "sample" | "custom";
export type SessionStatus = "uploading" | "detecting" | "browsing" | "generating" | "locked" | "priced";

export interface DesignSession {
  id: string;
  clothing_image_url: string;
  detected_category: ClothingCategory | null;
  clothing_description: string | null;
  path_type: PathType | null;
  selected_sample_key: StyleKey | null;
  custom_instructions: string | null;
  custom_reference_url: string | null;
  current_design_url: string | null;
  generation_count: number;
  is_locked: boolean;
  pricing_category: string | null;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  session_id: string;
  attempt_number: number;
  prompt_used: string;
  result_image_url: string;
  created_at: string;
}

export interface DetectionResult {
  category: ClothingCategory;
  confidence: "high" | "medium" | "low";
  description: string;
}

export interface GenerationParams {
  clothingImageUrl: string;
  clothingDescription: string;
  garmentType: ClothingCategory;
  pathType: PathType;
  stylePrompt: string;
  customReferenceUrl?: string;
  previousDesignUrl?: string;
}

export interface GenerationResult {
  imageUrl: string;
}

export interface SampleDesign {
  key: StyleKey;
  name: string;
  description: string;
  imageUrl: string;
}

export interface PricingEntry {
  styleKey: StyleKey | "custom";
  garmentType: ClothingCategory;
  price: number;
  label: string;
}

export type FlowStep =
  | "upload"
  | "detecting"
  | "samples"
  | "custom"
  | "generating"
  | "result"
  | "pricing";

export interface FlowState {
  step: FlowStep;
  sessionId: string | null;
  clothingImageUrl: string | null;
  detectedCategory: ClothingCategory | null;
  clothingDescription: string | null;
  pathType: PathType | null;
  selectedSampleKey: StyleKey | null;
  customInstructions: string | null;
  customReferenceUrl: string | null;
  currentDesignUrl: string | null;
  generationCount: number;
  regenerationFeedback: string | null;
  pricingCategory: string | null;
  price: number | null;
}
