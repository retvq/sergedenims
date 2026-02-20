import type { AIProvider } from "./types";
import { OpenAIProvider } from "./openai";

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || "openai";
  if (provider === "openai") return new OpenAIProvider();
  throw new Error(`Unknown AI provider: ${provider}`);
}
