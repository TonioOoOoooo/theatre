import Stars from "./Stars";

export default function HomeScreen({ actorName, scenes, onSelectScene, onFilage, onBack, onReconfigure, progress }) {
  return (
    <div className="min-h-screen bg-theater-bg p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 text-theater-partner hover:text-white text-lg cursor-pointer"
        >
          ← Retour
        </button>
        <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-2 slide-up text-white">
          🎬 Le Théâtre de {actorName}
        </h1>
        <p className="text-center text-theater-partner mb-8 text-lg">
          Apprends tes répliques en t&apos;amusant !
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {scenes.map((scene) => {
            const stars = progress[scene.id] || 0;
            return (
              <button
                key={scene.id}
                onClick={() => onSelectScene(scene.id)}
                className={`relative rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer ${
                  scene.priority
                    ? "bg-gradient-to-br from-yellow-900/60 to-purple-900/60 border-2 border-yellow-400 glow-gold sm:col-span-2"
                    : "bg-theater-card border border-purple-800/50 hover:border-purple-500/70"
                }`}
              >
                {scene.priority && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full bounce-in">
                    NOUVEAU !
                  </span>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl md:text-4xl">{scene.emoji}</span>
                  <div>
                    <h2
                      className={`font-bold ${
                        scene.priority
                          ? "text-xl md:text-2xl text-yellow-300"
                          : "text-lg md:text-xl text-white"
                      }`}
                    >
                      {scene.title}
                    </h2>
                    <p className="text-sm text-theater-partner">
                      {actorName} joue :{" "}
                      <span className="font-semibold text-purple-300">
                        {scene.leoRole}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Stars count={stars} />
                  {stars === 0 && (
                    <span className="text-sm text-theater-partner ml-2">
                      Continue pour gagner des étoiles !
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onFilage}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            🎬 Mode Filage — Enchaîner toutes les saynètes
          </button>
          <button
            onClick={onReconfigure}
            className="w-full py-3 rounded-2xl bg-theater-card border border-purple-800/50 hover:border-purple-400 text-theater-partner hover:text-white font-medium text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            ⚙️ Changer de profil / Modifier les saynètes
          </button>
        </div>
      </div>
    </div>
  );
}
