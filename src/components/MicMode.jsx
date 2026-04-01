import { useState, useRef, useCallback, useEffect } from "react";
import { SpeechRecognitionAPI, hasSpeechRecognition, speak, hasSpeechSynthesis } from "../utils/speech";
import { compareTexts, getHint } from "../utils/textCompare";
import { getEncouragement } from "../utils/encouragements";
import { playSuccess, playAlmost, playFanfare, playStar } from "../utils/sounds";
import Confetti, { MiniConfetti } from "./Confetti";

export default function MicMode({ scene, onBack, onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'almost'|'retry', message }
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [scores, setScores] = useState([]); // per leo-line: 1 (no hint), 0.5 (1-2 hints), 0 (3+ hints)
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMiniConfetti, setShowMiniConfetti] = useState(false);
  const [miniConfettiKey, setMiniConfettiKey] = useState(0);
  const recognitionRef = useRef(null);

  const line = scene.lines[lineIndex];
  const isFinished = lineIndex >= scene.lines.length;
  const isLeoLine = line && !line.dida && line.speaker === scene.leoRole;
  const isDida = line && line.dida;
  const isPartnerLine = line && !line.dida && line.speaker !== scene.leoRole;

  const computeStars = useCallback((finalScores) => {
    const leoLines = scene.lines.filter((l) => !l.dida && l.speaker === scene.leoRole);
    const total = leoLines.length;
    if (total === 0) return 0;
    const perfect = finalScores.filter((s) => s === 1).length;
    const ratio = perfect / total;
    if (ratio >= 1) return 3;
    if (ratio >= 0.7) return 2;
    return 1;
  }, [scene]);

  function handleNext() {
    setFeedback(null);
    setSpokenText("");
    setHintLevel(0);
    setLineIndex((i) => i + 1);
  }

  function autoAdvancePartnerOrDida() {
    setFeedback(null);
    setSpokenText("");
    setHintLevel(0);
    setLineIndex((prev) => prev + 1);
  }

  function handleHint() {
    const newLevel = Math.min(hintLevel + 1, 4);
    setHintLevel(newLevel);
  }

  function startListening() {
    if (!hasSpeechRecognition) return;
    setSpokenText("");
    setFeedback(null);

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event) => {
      let bestMatch = "";
      let bestScore = 0;

      for (let i = 0; i < event.results[0].length; i++) {
        const transcript = event.results[0][i].transcript;
        const score = compareTexts(transcript, line.text);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = transcript;
        }
      }

      setSpokenText(bestMatch);
      evaluateAnswer(bestMatch);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setFeedback({ type: "retry", message: "Je n'ai pas entendu… Essaie encore ! 🎤" });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }

  function triggerMiniConfetti() {
    setShowMiniConfetti(true);
    setMiniConfettiKey((k) => k + 1);
    setTimeout(() => setShowMiniConfetti(false), 2500);
  }

  function evaluateAnswer(spoken) {
    const score = compareTexts(spoken, line.text);

    if (score > 0.7) {
      const lineScore = hintLevel === 0 ? 1 : hintLevel <= 2 ? 0.5 : 0;
      setScores((prev) => [...prev, lineScore]);
      setFeedback({ type: "success", message: getEncouragement("success") });
      playSuccess();
      triggerMiniConfetti();
    } else if (score >= 0.4) {
      setFeedback({ type: "almost", message: getEncouragement("almost") });
      playAlmost();
    } else {
      setFeedback({ type: "retry", message: getEncouragement("retry") });
    }
  }

  // Finished screen
  if (isFinished) {
    const stars = computeStars(scores);
    if (onComplete) onComplete(stars);

    return <FinishScreen
      stars={stars}
      onRestart={() => {
        setLineIndex(0);
        setScores([]);
        setFeedback(null);
        setHintLevel(0);
        setSpokenText("");
        setShowConfetti(false);
      }}
      onBack={onBack}
    />;
  }

  // Auto-show partner lines and didascalies
  if (isDida || isPartnerLine) {
    return (
      <div className="min-h-screen bg-theater-bg p-4 md:p-8 flex flex-col text-white">
        <button
          onClick={onBack}
          className="self-start mb-4 text-theater-partner hover:text-white text-lg cursor-pointer"
        >
          ← Retour
        </button>

        <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full">
          <ProgressBar current={lineIndex} total={scene.lines.length} />

          <div className="fade-in w-full text-center mb-8" key={lineIndex}>
            {isDida ? (
              <p className="italic text-theater-dida text-base">({line.text})</p>
            ) : (
              <>
                <p className="text-sm font-semibold text-purple-400 mb-2 uppercase tracking-wider">
                  {line.speaker}
                </p>
                <p className="text-xl md:text-2xl text-theater-partner italic leading-relaxed">
                  {line.text}
                </p>
              </>
            )}
          </div>

          <div className="flex gap-4">
            {hasSpeechSynthesis && !isDida && (
              <button
                onClick={() => speak(line.text)}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-lg transition-all cursor-pointer"
              >
                🔊
              </button>
            )}
            <button
              onClick={autoAdvancePartnerOrDida}
              className="px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 font-bold text-xl transition-all cursor-pointer"
            >
              Suivant ➡️
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Leo's turn — mic mode
  return (
    <div className="min-h-screen bg-theater-bg p-4 md:p-8 flex flex-col text-white">
      {showMiniConfetti && <MiniConfetti key={miniConfettiKey} />}
      <button
        onClick={onBack}
        className="self-start mb-4 text-theater-partner hover:text-white text-lg cursor-pointer"
      >
        ← Retour
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full">
        <ProgressBar current={lineIndex} total={scene.lines.length} />

        <p className="text-sm font-semibold text-yellow-400 mb-2 uppercase tracking-wider">
          {scene.leoRole} (toi) — À ton tour !
        </p>

        {/* Hint display */}
        {hintLevel > 0 && hintLevel < 4 ? (
          <p className="text-xl md:text-2xl font-bold text-amber-300 mb-4 text-center fade-in">
            💡 {getHint(line.text, hintLevel)}
          </p>
        ) : hintLevel >= 4 ? (
          <p className="text-xl md:text-2xl font-bold text-orange-300 mb-4 text-center fade-in">
            {line.text}
          </p>
        ) : (
          <p className="text-2xl md:text-3xl font-bold text-theater-leo/30 mb-4 text-center">
            ❓❓❓
          </p>
        )}

        {/* Spoken text */}
        {spokenText && (
          <p className="text-base text-gray-400 mb-2 text-center italic fade-in">
            Tu as dit : « {spokenText} »
          </p>
        )}

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-4 px-6 py-3 rounded-xl text-center text-lg font-bold fade-in ${
              feedback.type === "success"
                ? "bg-green-600/30 text-green-300"
                : feedback.type === "almost"
                ? "bg-amber-600/30 text-amber-300"
                : "bg-purple-600/30 text-purple-300"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          {feedback?.type === "success" ? (
            <button
              onClick={handleNext}
              className="px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 font-bold text-xl transition-all cursor-pointer bounce-in"
            >
              Suivant ➡️
            </button>
          ) : (
            <>
              {!hasSpeechRecognition ? (
                <p className="text-amber-400 text-center">
                  ⚠️ Ton navigateur ne supporte pas le micro. Utilise Chrome !
                </p>
              ) : isListening ? (
                <button
                  onClick={stopListening}
                  className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-400 font-bold text-4xl transition-all cursor-pointer mic-pulse flex items-center justify-center"
                >
                  ⏹️
                </button>
              ) : (
                <button
                  onClick={startListening}
                  className="w-24 h-24 rounded-full bg-green-500 hover:bg-green-400 font-bold text-4xl transition-all cursor-pointer flex items-center justify-center"
                >
                  🎤
                </button>
              )}

              <p className="text-theater-partner text-sm">
                {isListening ? "Je t'écoute… parle !" : "Appuie sur le micro et dis ta réplique !"}
              </p>

              {/* Hint + validate + skip buttons */}
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {hintLevel < 4 && (
                  <button
                    onClick={handleHint}
                    className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 font-bold transition-all cursor-pointer"
                  >
                    💡 Un indice
                  </button>
                )}
                <button
                  onClick={() => {
                    const lineScore = hintLevel === 0 ? 1 : hintLevel <= 2 ? 0.5 : 0;
                    setScores((prev) => [...prev, lineScore]);
                    setFeedback({ type: "success", message: "C'est validé ! 👍" });
                    playSuccess();
                    triggerMiniConfetti();
                  }}
                  className="px-5 py-2 rounded-xl bg-green-700 hover:bg-green-600 font-bold transition-all cursor-pointer"
                >
                  ✅ C'est bon !
                </button>
                {hintLevel >= 4 && (
                  <button
                    onClick={() => {
                      setScores((prev) => [...prev, 0]);
                      handleNext();
                    }}
                    className="px-5 py-2 rounded-xl bg-gray-600 hover:bg-gray-500 font-bold transition-all cursor-pointer"
                  >
                    Passer ➡️
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-theater-partner text-sm mt-4">
        Réplique {lineIndex + 1} / {scene.lines.length}
      </p>
    </div>
  );
}

const BRAVO_MESSAGES = [
  { stars: 3, emoji: "👑", title: "INCROYABLE !", subtitle: "Tu connais TOUT par cœur !", detail: "Tu es un vrai comédien ! 🎭✨" },
  { stars: 2, emoji: "🏆", title: "SUPER BRAVO !", subtitle: "Tu connais presque tout !", detail: "Encore un petit effort et c'est parfait ! 💪" },
  { stars: 1, emoji: "🌟", title: "BRAVO !", subtitle: "C'est un bon début !", detail: "Continue à t'entraîner, champion ! 🎭" },
];

function FinishScreen({ stars, onRestart, onBack }) {
  const [phase, setPhase] = useState(0); // 0=confetti, 1=title, 2=stars, 3=buttons
  const msg = BRAVO_MESSAGES.find((m) => m.stars === stars) || BRAVO_MESSAGES[2];

  useEffect(() => {
    playFanfare();
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => {
      setPhase(2);
      playStar();
    }, 1200);
    const t3 = setTimeout(() => setPhase(3), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="min-h-screen bg-theater-bg p-4 flex flex-col items-center justify-center text-white overflow-hidden">
      <Confetti />

      {/* Giant emoji */}
      <div className={`transition-all duration-700 ${phase >= 0 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
        <span className="text-8xl md:text-9xl block mb-4 bounce-in">{msg.emoji}</span>
      </div>

      {/* Title */}
      <div className={`transition-all duration-700 ${phase >= 1 ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-2 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
          {msg.title}
        </h1>
        <p className="text-xl md:text-2xl text-center text-white/90 font-bold mb-2">
          {msg.subtitle}
        </p>
        <p className="text-lg text-center text-theater-partner mb-6">
          {msg.detail}
        </p>
      </div>

      {/* Stars with staggered animation */}
      <div className={`flex gap-3 mb-8 transition-all duration-700 ${phase >= 2 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={i}
            className={`text-5xl md:text-6xl transition-all ${i < stars ? "bounce-in" : "opacity-30"}`}
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className={`flex gap-4 transition-all duration-700 ${phase >= 3 ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <button
          onClick={onRestart}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          🔁 Recommencer
        </button>
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-2xl bg-gray-700 hover:bg-gray-600 font-bold text-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          ← Retour
        </button>
      </div>
    </div>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
      <div
        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${((current + 1) / total) * 100}%` }}
      />
    </div>
  );
}
