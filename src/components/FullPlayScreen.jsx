import { useState, useEffect, useRef } from "react";
import { PLAY_INFO, FULL_SCENES, VIDEOS } from "../data/fullPlay";
import { playMusic } from "../utils/music";

export default function FullPlayScreen({ onBack }) {
  const [view, setView] = useState("toc"); // toc | scene | info | author | fabrique | videos
  const [selectedScene, setSelectedScene] = useState(null);

  useEffect(() => {
    playMusic("/Game.mp3", { loop: true, volume: 0.25 });
  }, []);

  if (view === "info") return <InfoPage onBack={() => setView("toc")} />;
  if (view === "author") return <AuthorPage onBack={() => setView("toc")} />;
  if (view === "fabrique") return <FabriquePage onBack={() => setView("toc")} />;
  if (view === "videos") return <VideosPage onBack={() => setView("toc")} />;

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
          ← Retour
        </button>

        <div className="text-center mb-8 slide-up">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-1">📖 {PLAY_INFO.title}</h1>
          <h2 className="text-xl md:text-2xl text-purple-300 font-bold mb-2">{PLAY_INFO.subtitle}</h2>
          <p className="text-theater-partner text-sm">{PLAY_INFO.author}</p>
          <p className="text-theater-partner text-xs">{PLAY_INFO.publisher}</p>
          <p className="text-center italic text-theater-partner text-xs mt-2 whitespace-pre-line">{PLAY_INFO.dedication}</p>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <button onClick={() => setView("info")} className="w-full py-3 rounded-xl bg-theater-card border border-purple-800/50 hover:border-purple-400 transition-all cursor-pointer text-center text-sm">
            🎭 Personnages & Voix blanche
          </button>
          <button onClick={() => setView("author")} className="w-full py-3 rounded-xl bg-theater-card border border-purple-800/50 hover:border-purple-400 transition-all cursor-pointer text-center text-sm">
            ✍️ L'auteur — Gérald Chevrolet
          </button>
          <button onClick={() => setView("fabrique")} className="w-full py-3 rounded-xl bg-theater-card border border-purple-800/50 hover:border-purple-400 transition-all cursor-pointer text-center text-sm">
            🧵 Petite Fabrique de Miche et Drate
          </button>
          <button onClick={() => setView("videos")} className="w-full py-3 rounded-xl bg-gradient-to-r from-red-900/60 to-purple-900/60 border border-red-500/50 hover:border-red-400 transition-all cursor-pointer text-center text-sm">
            🎬 Vidéos — Interprétations
          </button>
        </div>

        <h3 className="text-lg font-bold text-purple-300 mb-3">Les 24 saynètes</h3>
        <div className="space-y-2 mb-8">
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

function TextPage({ title, onBack, children }) {
  return (
    <div className="min-h-screen bg-theater-bg p-4 md:p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="mb-6 text-theater-partner hover:text-white text-lg cursor-pointer">
          ← Retour au sommaire
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 slide-up">{title}</h2>
        <div className="slide-up space-y-6">{children}</div>
      </div>
    </div>
  );
}

function InfoPage({ onBack }) {
  return (
    <TextPage title="🎭 Personnages & Voix blanche" onBack={onBack}>
      <div className="bg-theater-card rounded-2xl p-5 border border-purple-800/30">
        <h3 className="text-lg font-bold text-yellow-300 mb-3">Personnages</h3>
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
        <p className="text-theater-partner text-sm leading-relaxed">{PLAY_INFO.voixBlanche}</p>
      </div>
      <div className="bg-theater-card rounded-2xl p-5 border border-purple-800/30">
        <h3 className="text-lg font-bold text-yellow-300 mb-3">🎪 Création</h3>
        <p className="text-theater-partner text-sm leading-relaxed">{PLAY_INFO.creation}</p>
      </div>
    </TextPage>
  );
}

function AuthorPage({ onBack }) {
  return (
    <TextPage title="✍️ Gérald Chevrolet" onBack={onBack}>
      <div className="bg-theater-card rounded-2xl p-5 border border-purple-800/30">
        <p className="text-theater-partner text-sm leading-relaxed whitespace-pre-line">{PLAY_INFO.authorBio}</p>
      </div>
    </TextPage>
  );
}

function FabriquePage({ onBack }) {
  return (
    <TextPage title="🧵 Petite Fabrique de Miche et Drate" onBack={onBack}>
      <div className="bg-theater-card rounded-2xl p-5 border border-purple-800/30">
        <p className="text-theater-partner text-sm leading-relaxed whitespace-pre-line">{PLAY_INFO.petiteFabrique}</p>
      </div>
    </TextPage>
  );
}

function VideosPage({ onBack }) {
  return (
    <TextPage title="🎬 Vidéos — Interprétations" onBack={onBack}>
      <p className="text-theater-partner text-sm text-center mb-2">
        Découvre des interprétations de Miche et Drate !
      </p>
      <div className="space-y-6">
        {VIDEOS.map((video) => (
          <div key={video.youtubeId + video.title} className="bg-theater-card rounded-2xl overflow-hidden border border-purple-800/30">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white text-base">{video.title}</h3>
              {video.scene && (
                <p className="text-theater-partner text-xs mt-1">Saynète n°{video.scene}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </TextPage>
  );
}

function SceneReader({ scene, onBack, onNext, onPrev }) {
  const topRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const video = VIDEOS.find((v) => v.scene === scene.number);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-theater-bg p-4 md:p-8 text-white">
      <div className="max-w-2xl mx-auto" ref={topRef}>
        <button
          onClick={onBack}
          className="mb-4 text-theater-partner hover:text-white text-lg cursor-pointer"
        >
          ← Sommaire
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 slide-up">
          <span className="text-purple-400">{scene.number}.</span> {scene.title}
        </h2>

        <div className="space-y-4 mb-10">
          {scene.lines.map((line, i) => (
            <LineDisplay key={i} line={line} />
          ))}
        </div>

        {video && (
          <div className="mb-8">
            {!showVideo ? (
              <button
                onClick={() => setShowVideo(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-900/60 to-purple-900/60 border border-red-500/40 hover:border-red-400 text-white font-bold text-base transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                🎬 Voir une interprétation de cette saynète
              </button>
            ) : (
              <div className="bg-theater-card rounded-2xl overflow-hidden border border-purple-800/30">
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-theater-partner text-sm">🎬 Interprétation — {video.title}</span>
                  <button onClick={() => setShowVideo(false)} className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer">
                    Masquer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center gap-4 mb-8">
          {onPrev && (
            <button
              onClick={() => { onPrev(); scrollToTop(); setShowVideo(false); }}
              className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold cursor-pointer transition-all"
            >
              ← Précédente
            </button>
          )}
          <button
            onClick={onBack}
            className="px-5 py-3 rounded-xl bg-theater-card border border-purple-800/30 hover:border-purple-400 font-bold cursor-pointer transition-all"
          >
            📖 Sommaire
          </button>
          {onNext && (
            <button
              onClick={() => { onNext(); scrollToTop(); setShowVideo(false); }}
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

function LineDisplay({ line }) {
  if (line.dida) {
    return (
      <p className="italic text-theater-dida text-sm pl-4 border-l-2 border-theater-dida/30">
        {line.text}
      </p>
    );
  }

  const isMiche = line.speaker === "MICHE";

  return (
    <div className="mb-1">
      <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${isMiche ? "text-yellow-400" : "text-purple-400"}`}>
        {line.speaker}
        {line.note && <span className="normal-case text-theater-dida italic font-normal"> ({line.note})</span>}
      </p>
      <p className={`text-base md:text-lg leading-relaxed ${isMiche ? "text-theater-leo" : "text-theater-partner"}`}>
        {line.text}
      </p>
    </div>
  );
}
