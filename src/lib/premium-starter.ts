// src/templates/premium-starter.ts  v2.4
// Routes to the correct premium template based on niche.
// Agrega soporte para el template "rochas" (rotisería custom).

import { BusinessData, NICHE_CONFIGS } from "../lib/types";
import { renderGastro }          from "./gastro-template";
import { renderBeauty }          from "./beauty-template";
import { renderGym }             from "./gym-template";
import { renderDefault }         from "./default-template";
import { generateRochasHTML }    from "./rochas-template";

export function renderPremiumStarter(data: BusinessData): string {
  const templateType = NICHE_CONFIGS[data.niche]?.templateType ?? "default";

  switch (templateType) {
    case "gastro":  return renderGastro(data);
    case "beauty":  return renderBeauty(data);
    case "gym":     return renderGym(data);
    case "rochas":  return generateRochasHTML(data);
    default:        return renderDefault(data);
  }
}
