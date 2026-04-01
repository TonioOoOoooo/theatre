import { useState } from "react";
import { FULL_SCENES } from "../data/fullPlay";
import { LEO_DEFAULT, saveActorConfig } from "../utils/actorConfig";

const SCENE_EMOJIS = {
  1: "😨", 2: "😴", 3: "🫥", 4: "🫧", 5: "👀", 6: "🌋",
  7: "😢", 8: "🥱", 9: "👁️", 10: "💇", 11: "📏", 12: "🎂",
  13: "⚔️", 14: "🪖", 15: "🐍", 16: "🎭", 17: "💃", 18: "🎩",
  19: "🤲", 20: "🗿", 21: "❤️", 22: "⬇️", 23: "💀", 24: "🪶",
};

export default function ActorSetup({ initialConfig, onDone, onBack }) {
  const [step, setStep] = useState("who"); // who | name | scenes | roles
  const [isLeo, setIsLeo] = useState(true);
  const [name, setName] = useState(initialConfig?.name || "");
  const [selectedScenes, setSelectedScenes] = useState(
    () => new Set(initialConfig?.scenes?.map((s) => s.sceneNumber) || [])
  );
  const [roles, setRoles] = useState(() => {
    const map = {};
    if (initialConfig?.scenes) {
      initialConfig.scenes.forEach((s) => { map[s.sceneNumber] = s.role; });
    }
    return map;
  });

  const handleChooseLeo = () => {
    saveActorConfig(LEO_DEFAULT);
    onDone(LEO_DEFAULT);
  };

  const handleChooseOther = () => {
    setIsLeo(false);
    setName("");
    setSelectedScenes(new Set());
    setRoles({});
    setStep("name");
  };

  const toggleScene = (num) => {
    setSelectedScenes((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const handleScenesNext = () => {
    const newRoles = { ...roles };
    selectedScenes.forEach((num) => {
      if (!newRoles[num]) newRoles[num] = "MICHE";
    });
    setRoles(newRoles);
    setStep("roles");
  };

  const handleFinish = () => {
    const scenes = Array.from(selectedScenes)
      .sort((a, b) => a - b)
      .map((num) => {
        const full = FULL_SCENES.find((s) => s.number === num);
        return {
          sceneNumber: num,
          role: roles[num] || "MICHE",
          title: full?.title || `Saynète ${num}`,
          emoji: SCENE_EMOJIS[num] || "🎭",
        };
      });
    const config = { name: name.trim() || "Acteur", scenes };
    saveActorConfig(config);
    onDone(config);
  };

  // Step 1: Who are you?
  if (step === "who") {
    return (
      <div className="min-h-screen bg-theater-bg flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-lg w-full text-center slide-up">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">🎬 Qui es-tu ?</h1>
          <p className="text-theater-partner mb-8">Choisis ton profil pour commencer</p>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleChooseLeo}
              className="w-full py-5 rounded-2xl bg-gradient-to-br from-yellow-900/60 to-purple-900/60 border-2 border-yellow-400 hover:border-yellow-300 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] glow-gold"
            >
              <span className="text-2xl block mb-1">⭐</span>
              <span className="text-xl font-bold text-yellow-300 block">Je suis Léo !</span>
              <span className="text-theater-partner text-sm block mt-1">
                La Mort, Le Cadeau de l'Oiseau, La Conscience, La Sculpture
              </span>
            </button>

            <button
              onClick={handleChooseOther}
              className="w-full py-5 rounded-2xl bg-theater-card border border-purple-800/50 hover:border-purple-400 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-2xl block mb-1">🙋</span>
              <span className="text-xl font-bold block">Je suis quelqu'un d'autre !</span>
              <span className="text-theater-partner text-sm block mt-1">
                Choisis ton prénom, tes saynètes et tes rôles
              </span>
            </button>
          </div>

          {onBack && (
            <button onClick={onBack} className="mt-6 text-theater-partner hover:text-white text-sm cursor-pointer">
              ← Retour
            </button>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Enter name
  if (step === "name") {
    return (
      <div className="min-h-screen bg-theater-bg flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-lg w-full text-center slide-up">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">🙋 Comment tu t'appelles ?</h1>
          <p className="text-theater-partner mb-8">Entre ton prénom</p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ton prénom..."
            autoFocus
            className="w-full text-center text-2xl font-bold py-4 px-6 rounded-2xl bg-theater-card border border-purple-800/50 focus:border-purple-400 outline-none text-white placeholder-gray-500 mb-6"
          />

          <button
            onClick={() => name.trim() && setStep("scenes")}
            disabled={!name.trim()}
            className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:opacity-50 text-white font-bold text-lg transition-all cursor-pointer"
          >
            Suivant →
          </button>

          <button onClick={() => setStep("who")} className="mt-4 text-theater-partner hover:text-white text-sm cursor-pointer">
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Select scenes
  if (step === "scenes") {
    return (
      <div className="min-h-screen bg-theater-bg p-4 md:p-8 text-white">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-2 slide-up">
            🎭 Salut {name} !
          </h1>
          <p className="text-center text-theater-partner mb-6">
            Quelles saynètes dois-tu apprendre ? <span className="text-purple-300">(choisis-en au moins une)</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {FULL_SCENES.map((scene) => {
              const selected = selectedScenes.has(scene.number);
              return (
                <button
                  key={scene.number}
                  onClick={() => toggleScene(scene.number)}
                  className={`rounded-xl p-3 text-left transition-all cursor-pointer flex items-center gap-3 ${
                    selected
                      ? "bg-purple-700/60 border-2 border-purple-400"
                      : "bg-theater-card border border-purple-800/30 hover:border-purple-600/50"
                  }`}
                >
                  <span className="text-xl">{selected ? "✅" : (SCENE_EMOJIS[scene.number] || "🎭")}</span>
                  <div>
                    <span className="font-semibold text-sm">{scene.number}. {scene.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("name")} className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold cursor-pointer transition-all">
              ← Retour
            </button>
            <button
              onClick={handleScenesNext}
              disabled={selectedScenes.size === 0}
              className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:opacity-50 font-bold text-lg transition-all cursor-pointer"
            >
              Choisir les rôles → ({selectedScenes.size} saynète{selectedScenes.size > 1 ? "s" : ""})
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Choose roles per scene
  if (step === "roles") {
    const sortedScenes = Array.from(selectedScenes).sort((a, b) => a - b);
    return (
      <div className="min-h-screen bg-theater-bg p-4 md:p-8 text-white">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-2 slide-up">
            🎭 Quel rôle pour {name} ?
          </h1>
          <p className="text-center text-theater-partner mb-6">
            Pour chaque saynète, choisis si tu joues <span className="text-yellow-400 font-bold">MICHE</span> ou <span className="text-purple-400 font-bold">DRATE</span>
          </p>

          <div className="space-y-3 mb-6">
            {sortedScenes.map((num) => {
              const full = FULL_SCENES.find((s) => s.number === num);
              const role = roles[num] || "MICHE";
              return (
                <div key={num} className="bg-theater-card rounded-xl p-4 border border-purple-800/30 flex items-center gap-3 flex-wrap">
                  <span className="text-xl">{SCENE_EMOJIS[num] || "🎭"}</span>
                  <span className="font-semibold text-sm flex-1 min-w-32">{num}. {full?.title}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRoles((prev) => ({ ...prev, [num]: "MICHE" }))}
                      className={`px-4 py-2 rounded-lg font-bold text-sm cursor-pointer transition-all ${
                        role === "MICHE"
                          ? "bg-yellow-600 text-white border-2 border-yellow-400"
                          : "bg-gray-700 text-gray-300 border border-gray-600 hover:border-yellow-600"
                      }`}
                    >
                      MICHE
                    </button>
                    <button
                      onClick={() => setRoles((prev) => ({ ...prev, [num]: "DRATE" }))}
                      className={`px-4 py-2 rounded-lg font-bold text-sm cursor-pointer transition-all ${
                        role === "DRATE"
                          ? "bg-purple-600 text-white border-2 border-purple-400"
                          : "bg-gray-700 text-gray-300 border border-gray-600 hover:border-purple-600"
                      }`}
                    >
                      DRATE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("scenes")} className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold cursor-pointer transition-all">
              ← Retour
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 font-bold text-lg transition-all cursor-pointer"
            >
              C'est parti ! 🎬
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
