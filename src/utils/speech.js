export const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

export const hasSpeechRecognition = !!SpeechRecognitionAPI;
export const hasSpeechSynthesis = "speechSynthesis" in window;
export const hasMediaRecorder = "MediaRecorder" in window;

export function speak(text, onEnd) {
  if (!hasSpeechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "fr-FR";
  utter.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const frVoice = voices.find((v) => v.lang.startsWith("fr"));
  if (frVoice) utter.voice = frVoice;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}
