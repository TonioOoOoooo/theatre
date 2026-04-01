export default function ModeSelector({ scene, onSelect, onBack }) {
  const modes = [
    { id: "repetition", emoji: "📖", label: "Répétition", desc: "Lis et écoute les répliques" },
    { id: "micro", emoji: "🎤", label: "À toi de jouer !", desc: "Dis tes répliques au micro" },
    { id: "record", emoji: "🎧", label: "Écoute-toi", desc: "Enregistre-toi et réécoute" },
  ];

  return (
    <div className="min-h-screen bg-theater-bg p-4 md:p-8 flex flex-col items-center justify-center">
      <button
        onClick={onBack}
        className="self-start mb-6 text-theater-partner hover:text-white text-lg cursor-pointer"
      >
        ← Retour
      </button>
      <div className="max-w-md w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 slide-up text-white">
          {scene.emoji} {scene.title}
        </h2>
        <p className="text-center text-theater-partner mb-8">
          Choisis ton mode de jeu !
        </p>
        <div className="flex flex-col gap-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className="rounded-2xl p-5 bg-theater-card border border-purple-800/50 hover:border-purple-400 transition-all hover:scale-[1.02] active:scale-[0.98] text-left cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{mode.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{mode.label}</h3>
                  <p className="text-theater-partner text-sm">{mode.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
