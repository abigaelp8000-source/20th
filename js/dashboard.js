/* ================================================
   TWENTY IN PARADISE — Dashboard JS
   ================================================ */

const BIRTHDAY = new Date('2026-07-24T00:00:00');

// ── WELCOME MODAL ──
window.addEventListener('DOMContentLoaded', () => {
  // Show modal briefly then allow dismiss
  setTimeout(() => {
    const modal = document.getElementById('welcome-modal');
    if (modal) modal.style.display = 'flex';
  }, 300);

  startDashCountdown();
});

function dismissWelcome() {
  const modal = document.getElementById('welcome-modal');
  modal.classList.add('hidden');
  setTimeout(() => modal.style.display = 'none', 700);
}

// ── COUNTDOWN ──
function startDashCountdown() {
  function tick() {
    const diff = BIRTHDAY - new Date();
    if (diff <= 0) return;
    document.getElementById('dd-days').textContent = Math.floor(diff / 86400000);
    document.getElementById('dd-hrs').textContent  = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
    document.getElementById('dd-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
  }
  tick();
  setInterval(tick, 60000);
}

// ── COMING SOON TOAST ──
let toastTimer;
function comingSoon(card) {
  const title = card.querySelector('.card-title').textContent;
  const toast = document.getElementById('toast');
  toast.textContent = `${title} — coming soon ✦`;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
}

// ── MUSIC ──
let playing = false;
function toggleMusic() {
  const audio = document.getElementById('bg-audio');
  const btn   = document.getElementById('music-btn');
  const label = document.getElementById('music-label');
  if (!audio.src || audio.error) { label.textContent = 'No audio'; return; }
  if (playing) {
    audio.pause(); playing = false;
    btn.classList.remove('playing'); label.textContent = 'Music';
  } else {
    audio.play().then(() => {
      playing = true; btn.classList.add('playing'); label.textContent = 'Playing';
    }).catch(() => { label.textContent = 'No audio'; });
  }
}
