import type { DetectionResult, GenerationParams, GenerationResult } from "../types";

export interface AIProvider {
  detectClothing(imageUrl: string): Promise<DetectionResult>;
  generateDesign(params: GenerationParams): Promise<GenerationResult>;
}
