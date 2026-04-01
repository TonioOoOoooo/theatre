import { useState, useRef } from "react";
import { hasMediaRecorder } from "../utils/speech";

export default function RecordMode({ scene, onBack }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingDone, setRecordingDone] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const leoLines = scene.lines.filter(
    (l) => !l.dida && l.speaker === scene.leoRole
  );

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        setRecordingDone(true);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setAudioUrl(null);
      setRecordingDone(false);
      setLineIndex(0);
    } catch {
      alert("Impossible d'accéder au micro. Vérifie les permissions !");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  function resetRecording() {
    setAudioUrl(null);
    setRecordingDone(false);
    setLineIndex(0);
  }

  if (!hasMediaRecorder) {
    return (
      <div className="min-h-screen bg-theater-bg p-4 flex flex-col items-center justify-center text-white">
        <p className="text-amber-400 text-center text-lg mb-4">
          ⚠️ Ton navigateur ne supporte pas l'enregistrement audio.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold text-lg transition-all cursor-pointer"
        >
          ← Retour
        </button>
      </div>
    );
  }

  // Playback screen
  if (recordingDone && audioUrl) {
    return (
      <div className="min-h-screen bg-theater-bg p-4 md:p-8 flex flex-col items-center justify-center text-white">
        <div className="text-6xl mb-4 bounce-in">🎧</div>
        <h2 className="text-2xl font-bold mb-6">Écoute-toi !</h2>

        <audio controls src={audioUrl} className="mb-6 w-full max-w-sm" />

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={resetRecording}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-lg transition-all cursor-pointer"
          >
            🗑️ Recommencer
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 font-bold text-lg transition-all cursor-pointer"
          >
            ✅ Valider et retour
          </button>
        </div>
      </div>
    );
  }

  // Recording / prompter screen
  return (
    <div className="min-h-screen bg-theater-bg p-4 md:p-8 flex flex-col text-white">
      <button
        onClick={() => {
          if (isRecording) stopRecording();
          onBack();
        }}
        className="self-start mb-4 text-theater-partner hover:text-white text-lg cursor-pointer"
      >
        ← Retour
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full">
        {!isRecording ? (
          <>
            <div className="text-6xl mb-4">🎤</div>
            <h2 className="text-2xl font-bold mb-2 text-center">
              Prêt à enregistrer ?
            </h2>
            <p className="text-theater-partner mb-6 text-center">
              Tes répliques vont s'afficher une par une.
              <br />
              Dis-les toutes dans l'enregistrement !
            </p>
            <button
              onClick={startRecording}
              className="w-28 h-28 rounded-full bg-red-500 hover:bg-red-400 font-bold text-5xl transition-all cursor-pointer flex items-center justify-center"
            >
              ⏺️
            </button>
            <p className="text-theater-partner text-sm mt-3">
              Appuie pour commencer
            </p>
          </>
        ) : (
          <>
            {/* Progress */}
            <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((lineIndex + 1) / leoLines.length) * 100}%`,
                }}
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 font-semibold text-sm uppercase tracking-wider">
                Enregistrement en cours…
              </span>
            </div>

            {/* Current Leo line to say */}
            {lineIndex < leoLines.length ? (
              <div className="fade-in text-center mb-8" key={lineIndex}>
                <p className="text-sm font-semibold text-yellow-400 mb-2 uppercase tracking-wider">
                  {scene.leoRole} (toi)
                </p>
                <p className="text-2xl md:text-3xl font-bold text-theater-leo leading-relaxed">
                  {leoLines[lineIndex].text}
                </p>
              </div>
            ) : (
              <div className="text-center mb-8 fade-in">
                <p className="text-2xl font-bold text-green-300">
                  C'est fini ! Appuie sur stop 🎉
                </p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              {lineIndex < leoLines.length && (
                <button
                  onClick={() => setLineIndex((i) => i + 1)}
                  className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xl transition-all cursor-pointer"
                >
                  Suivant ➡️
                </button>
              )}
              <button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 font-bold text-2xl transition-all cursor-pointer mic-pulse flex items-center justify-center"
              >
                ⏹️
              </button>
            </div>

            <p className="text-theater-partner text-sm mt-4">
              Réplique {Math.min(lineIndex + 1, leoLines.length)} /{" "}
              {leoLines.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
