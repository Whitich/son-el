'use strict';
// This player lives outside the game state. Round/restart actions never recreate it.
const musicTrack = new Audio('assets/d-minor-drone.wav');
musicTrack.loop = true;
musicTrack.preload = 'metadata';
const musicButton = document.getElementById('music');
const musicVolume = document.getElementById('music-volume');
const musicLevel = document.getElementById('music-level');
let musicEnabled = true;
try {
  const saved = JSON.parse(localStorage.getItem('sonel-music'));
  if (saved && Number.isFinite(saved.volume)) musicVolume.value = Math.max(0, Math.min(100, saved.volume));
  if (saved && typeof saved.enabled === 'boolean') musicEnabled = saved.enabled;
} catch {}
function saveMusic() {
  try { localStorage.setItem('sonel-music', JSON.stringify({volume: Number(musicVolume.value), enabled: musicEnabled})); } catch {}
}
function updateMusic() {
  musicTrack.volume = Number(musicVolume.value) / 100;
  musicLevel.textContent = musicVolume.value + '%';
  musicButton.textContent = musicEnabled ? (musicTrack.paused ? 'Müzik: başlat' : 'Müzik: açık') : 'Müzik: kapalı';
  musicButton.setAttribute('aria-pressed', String(musicEnabled && !musicTrack.paused));
}
async function playMusic() {
  if (!musicEnabled) return;
  try { await musicTrack.play(); updateMusic(); }
  catch { musicButton.textContent = 'Müzik: tekrar dene'; }
}
musicButton.onclick = () => {
  if (!musicTrack.paused && musicEnabled) { musicEnabled = false; musicTrack.pause(); }
  else { musicEnabled = true; playMusic(); }
  saveMusic(); updateMusic();
};
musicVolume.oninput = () => { updateMusic(); saveMusic(); };
// Start in a user gesture to satisfy browser autoplay restrictions.
document.getElementById('deal').addEventListener('click', () => {
  if (musicEnabled && musicTrack.paused) playMusic();
});
musicTrack.addEventListener('error', () => { musicButton.textContent = 'Müzik yüklenemedi'; });
updateMusic();
