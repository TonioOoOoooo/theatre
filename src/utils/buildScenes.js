import { FULL_SCENES } from "../data/fullPlay";
import { isDefaultLeo } from "./actorConfig";

export function buildScenesFromConfig(config) {
  if (!config?.scenes?.length) return [];

  const isLeo = isDefaultLeo(config);

  return config.scenes.map((entry, idx) => {
    const full = FULL_SCENES.find((s) => s.number === entry.sceneNumber);
    if (!full) return null;

    const leoRole = entry.role;
    const partnerRole = leoRole === "MICHE" ? "DRATE" : "MICHE";

    const lines = full.lines.map((line) => {
      if (line.dida) return { speaker: null, text: line.text, dida: true };
      return { speaker: line.speaker, text: line.text };
    });

    return {
      id: idx + 1,
      title: full.title,
      emoji: entry.emoji || "🎭",
      priority: isLeo && idx === 0,
      leoRole,
      partnerRole,
      lines,
    };
  }).filter(Boolean);
}
