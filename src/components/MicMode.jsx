import { useState, useRef, useCallback } from "react";
import { SpeechRecognitionAPI, hasSpeechRecognition, speak, hasSpeechSynthesis } from "../utils/speech";
import { compareTexts, getHint } from "../utils/textCompare";
import { getEncouragement } from "../utils/encouragements";
import Confetti from "./Confetti";

export default function MicMode({ scene, onBack, onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'almost'|'retry', message }
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [scores, setScores] = useState([]); // per leo-line: 1 (no hint), 0.5 (1-2 hints), 0 (3+ hints)
  const [showConfetti, setShowConfetti] = useState(false);
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

  function evaluateAnswer(spoken) {
    const score = compareTexts(spoken, line.text);

    if (score > 0.7) {
      const lineScore = hintLevel === 0 ? 1 : hintLevel <= 2 ? 0.5 : 0;
      setScores((prev) => [...prev, lineScore]);
      setFeedback({ type: "success", message: getEncouragement("success") });
    } else if (score >= 0.4) {
      setFeedback({ type: "almost", message: getEncouragement("almost") });
    } else {
      setFeedback({ type: "retry", message: getEncouragement("retry") });
    }
  }

  // Finished screen
  if (isFinished) {
    const stars = computeStars(scores);
    if (onComplete) onComplete(stars);

    return (
      <div className="min-h-screen bg-theater-bg p-4 flex flex-col items-center justify-center text-white">
        {showConfetti && <Confetti />}
        <div className="text-6xl mb-4 bounce-in">🏆</div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Bravo, champion !</h2>
        <div className="text-4xl mb-4 bounce-in">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className={i < stars ? "text-yellow-400" : "text-gray-600"}>
              ⭐
            </span>
          ))}
        </div>
        <p className="text-theater-partner mb-6 text-center text-lg">
          {stars === 3
            ? "Parfait ! Tu connais tout par cœur ! 🎭"
            : stars === 2
            ? "Super travail ! Continue comme ça !"
            : "Bien joué ! Recommence pour gagner plus d'étoiles !"}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setLineIndex(0);
              setScores([]);
              setFeedback(null);
              setHintLevel(0);
              setSpokenText("");
            }}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-lg transition-all cursor-pointer"
          >
            🔁 Recommencer
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

              {/* Hint + skip buttons */}
              <div className="flex gap-3 mt-2">
                {hintLevel < 4 && (
                  <button
                    onClick={handleHint}
                    className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 font-bold transition-all cursor-pointer"
                  >
                    💡 Un indice
                  </button>
                )}
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
