import { useState } from "react";
import { speak, hasSpeechSynthesis } from "../utils/speech";

export default function RepetitionMode({ scene, onBack }) {
  const [lineIndex, setLineIndex] = useState(0);
  const line = scene.lines[lineIndex];
  const isFinished = lineIndex >= scene.lines.length;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-theater-bg p-4 flex flex-col items-center justify-center text-white">
        <div className="text-6xl mb-4 bounce-in">🎭</div>
        <h2 className="text-2xl font-bold mb-4">Saynète terminée !</h2>
        <p className="text-theater-partner mb-6">Tu as lu toute la scène, bravo !</p>
        <div className="flex gap-4">
          <button
            onClick={() => setLineIndex(0)}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-lg transition-all cursor-pointer"
          >
            🔁 Relire
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold text-lg transition-all cursor-pointer"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  const isLeo = !line.dida && line.speaker === scene.leoRole;
  const isDida = !!line.dida;

  return (
    <div className="min-h-screen bg-theater-bg p-4 md:p-8 flex flex-col text-white">
      <button
        onClick={onBack}
        className="self-start mb-4 text-theater-partner hover:text-white text-lg cursor-pointer"
      >
        ← Retour
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full">
        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((lineIndex + 1) / scene.lines.length) * 100}%` }}
          />
        </div>

        <div className="fade-in w-full" key={lineIndex}>
          {isDida ? (
            <p className="text-center italic text-theater-dida text-base mb-8">
              ({line.text})
            </p>
          ) : (
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-purple-400 mb-2 uppercase tracking-wider">
                {line.speaker}
                {isLeo && " (toi)"}
              </p>
              <p
                className={`leading-relaxed ${
                  isLeo
                    ? "text-2xl md:text-3xl font-bold text-theater-leo"
                    : "text-xl md:text-2xl text-theater-partner italic"
                }`}
              >
                {line.text}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 items-center">
          {hasSpeechSynthesis && !isDida && (
            <button
              onClick={() => speak(line.text)}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-lg transition-all cursor-pointer"
            >
              🔊 Écouter
            </button>
          )}
          <button
            onClick={() => setLineIndex((i) => i + 1)}
            className="px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 font-bold text-xl transition-all cursor-pointer"
          >
            Suivant ➡️
          </button>
        </div>
      </div>

      <p className="text-center text-theater-partner text-sm mt-4">
        Réplique {lineIndex + 1} / {scene.lines.length}
      </p>
    </div>
  );
}
