let currentAudio = null;
let currentTrack = null;
let muted = true;
let defaultVolume = 0.3;
let listeners = [];

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  if (currentAudio) {
    currentAudio.volume = muted ? 0 : defaultVolume;
  }
  listeners.forEach((fn) => fn(muted));
  return muted;
}

export function onMuteChange(fn) {
  listeners.push(fn);
  return () => { listeners = listeners.filter((l) => l !== fn); };
}

export function playMusic(src, { loop = true, volume = 0.3 } = {}) {
  if (currentTrack === src && currentAudio && !currentAudio.paused) return;
  stopMusic();
  defaultVolume = volume;
  try {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = muted ? 0 : volume;
    audio.play().catch(() => {});
    currentAudio = audio;
    currentTrack = src;
  } catch {}
}

export function stopMusic() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    currentTrack = null;
  }
}

export function setMusicVolume(vol) {
  defaultVolume = vol;
  if (currentAudio) currentAudio.volume = muted ? 0 : vol;
}
