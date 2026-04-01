const AudioContext = window.AudioContext || window.webkitAudioContext;

let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export function playSuccess() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Bright ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    });
  } catch {}
}

export function playAlmost() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Two gentle ascending notes
    [392, 440].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.3);
    });
  } catch {}
}

export function playFanfare() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Epic fanfare: C-E-G-C-E-G-C (ascending with harmonics)
    const melody = [
      { freq: 261.63, time: 0, dur: 0.2 },
      { freq: 329.63, time: 0.15, dur: 0.2 },
      { freq: 392.00, time: 0.30, dur: 0.2 },
      { freq: 523.25, time: 0.45, dur: 0.3 },
      { freq: 659.25, time: 0.65, dur: 0.2 },
      { freq: 783.99, time: 0.80, dur: 0.3 },
      { freq: 1046.50, time: 1.0, dur: 0.6 },
    ];

    melody.forEach(({ freq, time, dur }) => {
      // Main tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + time);
      gain.gain.setValueAtTime(0.15, now + time + dur * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + dur + 0.1);

      // Harmonic layer
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2;
      gain2.gain.setValueAtTime(0.08, now + time);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + time + dur);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + time);
      osc2.stop(now + time + dur + 0.1);
    });
  } catch {}
}

export function playStar() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Sparkle sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch {}
}

// Preload audio files if they exist (for custom sounds added later)
const audioCache = {};

export async function playAudioFile(path) {
  try {
    if (!audioCache[path]) {
      const response = await fetch(path);
      const buffer = await response.arrayBuffer();
      const ctx = getCtx();
      audioCache[path] = await ctx.decodeAudioData(buffer);
    }
    const ctx = getCtx();
    const source = ctx.createBufferSource();
    source.buffer = audioCache[path];
    source.connect(ctx.destination);
    source.start();
  } catch {}
}
