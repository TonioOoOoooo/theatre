import { useEffect } from "react";
import { playMusic } from "../utils/music";

export default function WelcomeScreen({ onLecteurs, onActeurs }) {
  useEffect(() => {
    playMusic("/Start.mp3", { loop: true, volume: 0.3 });
  }, []);

  return (
    <div className="min-h-screen bg-theater-bg flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-lg w-full text-center slide-up">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-3">
          🎭 Miche et Drate
        </h1>
        <h2 className="text-xl md:text-2xl text-purple-300 font-bold mb-2">
          Paroles Blanches
        </h2>
        <p className="text-theater-partner text-sm mb-10">
          Gérald Chevrolet — Éditions Théâtrales, Jeunesse
        </p>

        <div className="flex flex-col gap-5">
          <button
            onClick={onLecteurs}
            className="w-full py-6 rounded-2xl bg-theater-card border border-purple-800/50 hover:border-purple-400 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-3xl block mb-2">📖</span>
            <span className="text-xl md:text-2xl font-bold block">Pour les lecteurs !</span>
            <span className="text-theater-partner text-sm block mt-1">
              Lire la pièce complète — 24 saynètes
            </span>
          </button>

          <button
            onClick={onActeurs}
            className="w-full py-6 rounded-2xl bg-gradient-to-br from-purple-700/80 to-indigo-700/80 border border-yellow-400/50 hover:border-yellow-400 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] glow-gold"
          >
            <span className="text-3xl block mb-2">🎬</span>
            <span className="text-xl md:text-2xl font-bold text-yellow-300 block">Pour les acteurs !</span>
            <span className="text-theater-partner text-sm block mt-1">
              Apprendre et répéter les répliques de Léo
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
