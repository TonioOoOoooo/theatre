const ENCOURAGEMENTS_SUCCESS = [
  "Bravo ! 🎉",
  "Super, tu connais bien ! 👏",
  "Excellent ! 🌟",
  "Parfait, champion ! 💪",
  "Tu gères ! 🎭",
  "Magnifique ! ✨",
];

const ENCOURAGEMENTS_ALMOST = [
  "Presque ! Encore un effort ! 💪",
  "Tu y es presque, champion ! 🌟",
  "C'est bien, continue ! 👏",
  "Pas mal du tout ! 😊",
];

const ENCOURAGEMENTS_RETRY = [
  "Essaie encore 💪",
  "Tu peux le faire ! 🌟",
  "Allez, on recommence ! 😊",
  "Courage, tu vas y arriver ! 🎭",
];

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getEncouragement(type) {
  if (type === "success") return randomFrom(ENCOURAGEMENTS_SUCCESS);
  if (type === "almost") return randomFrom(ENCOURAGEMENTS_ALMOST);
  return randomFrom(ENCOURAGEMENTS_RETRY);
}
