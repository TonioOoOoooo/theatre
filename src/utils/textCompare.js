export function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function compareTexts(spoken, expected) {
  const nSpoken = normalize(spoken);
  const nExpected = normalize(expected);
  if (nSpoken === nExpected) return 1.0;

  const wordsExpected = nExpected.split(" ").filter((w) => w.length > 0);
  const wordsSpoken = nSpoken.split(" ").filter((w) => w.length > 0);
  if (wordsExpected.length === 0) return wordsSpoken.length === 0 ? 1.0 : 0.0;

  let matched = 0;
  let lastFoundIndex = -1;
  for (const ew of wordsExpected) {
    for (let i = lastFoundIndex + 1; i < wordsSpoken.length; i++) {
      if (wordsSpoken[i] === ew) {
        matched++;
        lastFoundIndex = i;
        break;
      }
    }
  }
  return matched / wordsExpected.length;
}

export function getHint(text, level) {
  const words = text.split(" ");
  if (level === 1) return words.slice(0, 1).join(" ") + "…";
  if (level === 2) return words.slice(0, 3).join(" ") + "…";
  if (level === 3) return words.slice(0, Math.ceil(words.length / 2)).join(" ") + "…";
  return text;
}
