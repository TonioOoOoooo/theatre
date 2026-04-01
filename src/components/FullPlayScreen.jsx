import { useState } from "react";
import { PLAY_INFO, FULL_SCENES } from "../data/fullPlay";
import { speak, hasSpeechSynthesis } from "../utils/speech";

export default function FullPlayScreen({ onBack }) {
  const [view, setView] = useState("toc"); // toc | scene | info
  const [selectedScene, setSelectedScene] = useState(null);

  if (view === "info") {
    return <InfoPage onBack={() => setView("toc")} />;
  }

  if (view === "scene" && selectedScene !== null) {
    const scene = FULL_SCENES[selectedScene];
    return (
      <SceneReader
        scene={scene}
        onBack={() => { setView("toc"); setSelectedScene(null); }}
        onNext={selectedScene < FULL_SCENES.length - 1 ? () => setSelectedScene(selectedScene + 1) : null}
        onPrev={selectedScene > 0 ? () => setSelectedScene(selectedScene - 1) : null}
      />
    );
  }

  // Table of contents
  return (
    <div className="min-h-screen bg-theater-bg p-4 md:p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 text-theater-partner hover:text-white text-lg cursor-pointer"
        >
          ← Retour à l'accueil
        </button>

        <div className="text-center mb-8 slide-up">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-1">📖 {PLAY_INFO.title}</h1>
          <h2 className="text-xl md:text-2xl text-purple-300 font-bold mb-2">{PLAY_INFO.subtitle}</h2>
          <p className="text-theater-partner text-sm">{PLAY_INFO.author}</p>
          <p className="text-theater-partner text-xs">{PLAY_INFO.publisher}</p>
        </div>

        <button
          onClick={() => setView("info")}
          className="w-full mb-6 py-3 rounded-xl bg-theater-card border border-purple-800/50 hover:border-purple-400 transition-all cursor-pointer text-center"
        >
          📋 À propos de la pièce & personnages
        </button>

        <div className="space-y-2">
          {FULL_SCENES.map((scene, idx) => (
            <button
              key={scene.number}
              onClick={() => { setSelectedScene(idx); setView("scene"); }}
              className="w-full rounded-xl p-4 bg-theater-card border border-purple-800/30 hover:border-purple-400 transition-all cursor-pointer text-left flex items-center gap-3 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span className="text-purple-400 font-bold text-lg w-8 text-right shrink-0">
                {scene.number}
              </span>
              <span className="text-white font-semibold text-base md:text-lg">
                {scene.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoPage({ onBack }) {
  return (
    <div className="min-h-screen bg-theater-bg p-4 md:p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-theater-partner hover:text-white text-lg cursor-pointer"
        >
          ← Retour au sommaire
        </button>

        <div className="slide-up space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold mb-1">{PLAY_INFO.title}</h1>
            <h2 className="text-xl text-purple-300 font-bold">{PLAY_INFO.subtitle}</h2>
          </div>

          <p className="text-center italic text-theater-partner text-sm whitespace-pre-line">
            {PLAY_INFO.dedication}
          </p>

          <div className="bg-theater-card rounded-2xl p-5 border border-purple-800/30">
            <h3 className="text-lg font-bold text-yellow-300 mb-3">🎭 Personnages</h3>
            {PLAY_INFO.characters.map((c) => (
              <div key={c.name} className="mb-2">
                <span className="font-bold text-white">{c.name} </span>
                <span className="text-theater-partner">{c.desc}</span>
              </div>
            ))}
            <p className="text-theater-dida italic text-sm mt-3">{PLAY_INFO.note}</p>
          </div>

          <div className="bg-theater-card rounded-2xl p-5 border border-purple-800/30">
            <h3 className="text-lg font-bold text-yellow-300 mb-3">🤫 La « voix blanche »</h3>
            <p className="text-theater-partner text-sm leading-relaxed">
              {PLAY_INFO.voixBlanche}
            </p>
          </div>

          <div className="bg-theater-card rounded-2xl p-5 border border-purple-800/30">
            <h3 className="text-lg font-bold text-yellow-300 mb-3">🎪 Création</h3>
            <p className="text-theater-partner text-sm leading-relaxed">
              {PLAY_INFO.creation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneReader({ scene, onBack, onNext, onPrev }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  if (showAll) {
    return (
      <div className="min-h-screen bg-theater-bg p-4 md:p-8 text-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="text-theater-partner hover:text-white text-lg cursor-pointer"
            >
              ← Sommaire
            </button>
            <button
              onClick={() => { setShowAll(false); setLineIndex(0); }}
              className="text-purple-400 hover:text-purple-300 text-sm cursor-pointer"
            >
              Mode prompteur ▶
            </button>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 slide-up">
            {scene.number}. {scene.title}
          </h2>

          <div className="space-y-3">
            {scene.lines.map((line, i) => (
              <LineDisplay key={i} line={line} />
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8 mb-8">
            {onPrev && (
              <button
                onClick={() => { onPrev(); setShowAll(true); setLineIndex(0); }}
                className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold cursor-pointer transition-all"
              >
                ← Précédente
              </button>
            )}
            {onNext && (
              <button
                onClick={() => { onNext(); setShowAll(true); setLineIndex(0); }}
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold cursor-pointer transition-all"
              >
                Suivante →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Prompter mode
  const line = scene.lines[lineIndex];
  const isFinished = lineIndex >= scene.lines.length;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-theater-bg p-4 flex flex-col items-center justify-center text-white">
        <div className="text-5xl mb-4 bounce-in">🎭</div>
        <h2 className="text-2xl font-bold mb-2">{scene.number}. {scene.title}</h2>
        <p className="text-theater-partner mb-6">Fin de la saynète !</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setLineIndex(0)}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold cursor-pointer transition-all"
          >
            🔁 Relire
          </button>
          <button
            onClick={() => setShowAll(true)}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold cursor-pointer transition-all"
          >
            📄 Voir tout le texte
          </button>
          {onNext && (
            <button
              onClick={() => { onNext(); setLineIndex(0); }}
              className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-500 font-bold cursor-pointer transition-all"
            >
              Saynète suivante →
            </button>
          )}
          <button
            onClick={onBack}
            className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold cursor-pointer transition-all"
          >
            ← Sommaire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theater-bg p-4 md:p-8 flex flex-col text-white">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-theater-partner hover:text-white text-lg cursor-pointer"
        >
          ← Sommaire
        </button>
        <button
          onClick={() => setShowAll(true)}
          className="text-purple-400 hover:text-purple-300 text-sm cursor-pointer"
        >
          📄 Tout le texte
        </button>
      </div>

      <h2 className="text-center text-lg font-bold text-purple-300 mb-2">
        {scene.number}. {scene.title}
      </h2>

      <div className="w-full bg-gray-800 rounded-full h-2 mb-6 max-w-xl mx-auto">
        <div
          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((lineIndex + 1) / scene.lines.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full">
        <div className="fade-in w-full text-center mb-8" key={lineIndex}>
          <LineDisplay line={line} large />
        </div>

        <div className="flex gap-4 items-center">
          {hasSpeechSynthesis && !line.dida && (
            <button
              onClick={() => speak(line.text)}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-lg transition-all cursor-pointer"
            >
              🔊
            </button>
          )}
          {lineIndex > 0 && (
            <button
              onClick={() => setLineIndex((i) => i - 1)}
              className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold text-lg transition-all cursor-pointer"
            >
              ← Préc.
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

function LineDisplay({ line, large = false }) {
  if (line.dida) {
    return (
      <p className={`italic text-theater-dida ${large ? "text-base" : "text-sm"}`}>
        ({line.text})
      </p>
    );
  }

  const isMiche = line.speaker === "MICHE";

  return (
    <div className={large ? "mb-0" : "mb-1"}>
      <p className={`font-semibold uppercase tracking-wider ${large ? "text-sm mb-2" : "text-xs mb-0.5"} ${isMiche ? "text-yellow-400" : "text-purple-400"}`}>
        {line.speaker}
        {line.note && <span className="normal-case text-theater-dida italic font-normal"> ({line.note})</span>}
      </p>
      <p className={`leading-relaxed ${large ? "text-2xl md:text-3xl font-bold" : "text-base"} ${isMiche ? "text-theater-leo" : "text-theater-partner"}`}>
        {line.text}
      </p>
    </div>
  );
}
