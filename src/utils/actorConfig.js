const STORAGE_KEY = "theatre-actor-config";

const LEO_DEFAULT = {
  name: "Léo",
  scenes: [
    { sceneNumber: 23, role: "MICHE", title: "La Mort", emoji: "💀" },
    { sceneNumber: 24, role: "DRATE", title: "Le Cadeau de l'Oiseau", emoji: "🪶" },
    { sceneNumber: 9, role: "MICHE", title: "La Conscience", emoji: "👁️" },
    { sceneNumber: 20, role: "MICHE", title: "La Sculpture", emoji: "🗿" },
  ],
};

export function getActorConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return LEO_DEFAULT;
}

export function saveActorConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
}

export function resetActorConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return LEO_DEFAULT;
}

export function isDefaultLeo(config) {
  return config.name === "Léo" && config.scenes.length === LEO_DEFAULT.scenes.length &&
    config.scenes.every((s, i) => s.sceneNumber === LEO_DEFAULT.scenes[i].sceneNumber && s.role === LEO_DEFAULT.scenes[i].role);
}

export { LEO_DEFAULT };
