// src/templates/premium-starter.ts
// Routes to the correct premium template based on niche.
// Import this file everywhere — it's the single entry point for HTML generation.

import { BusinessData, NICHE_CONFIGS } from "../lib/types";
import { renderGastro } from "./gastro-template";
import { renderBeauty } from "./beauty-template";
import { renderGym }    from "./gym-template";
import { renderDefault } from "./default-template";

export function renderPremiumStarter(data: BusinessData): string {
  const templateType = NICHE_CONFIGS[data.niche]?.templateType ?? "default";

  switch (templateType) {
    case "gastro":  return renderGastro(data);
    case "beauty":  return renderBeauty(data);
    case "gym":     return renderGym(data);
    default:        return renderDefault(data);
  }
}
