import { useState, useEffect } from "react";
import { isMuted, toggleMute, onMuteChange } from "../utils/music";

export default function MusicToggle() {
  const [muted, setMuted] = useState(isMuted());
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    return onMuteChange(setMuted);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {showTip && (
        <div className="bg-gray-900 border border-purple-800/50 rounded-xl px-3 py-2 text-xs text-theater-partner max-w-48 shadow-lg slide-up">
          Musique de fond uniquement — les vidéos et la lecture vocale ne sont pas affectées
        </div>
      )}
      <button
        onClick={() => toggleMute()}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onTouchStart={() => { setShowTip(true); setTimeout(() => setShowTip(false), 3000); }}
        className="px-3 py-2 rounded-full bg-theater-card border border-purple-800/50 hover:border-purple-400 text-white cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm flex items-center gap-1.5"
      >
        <span className="text-lg">{muted ? "🔇" : "🎵"}</span>
        <span className="text-xs font-medium hidden sm:inline">{muted ? "Musique OFF" : "Musique ON"}</span>
      </button>
    </div>
  );
}
