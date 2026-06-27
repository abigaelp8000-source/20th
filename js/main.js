/* TWENTY IN PARADISE — Main JS */

const BIRTHDAY = new Date('2026-07-24T00:00:00');

const S = {
  loading:    document.getElementById('screen-loading'),
  slideshow:  document.getElementById('screen-slideshow'),
  title:      document.getElementById('screen-title'),
  invitation: document.getElementById('screen-invitation'),
  confirmed:  document.getElementById('screen-confirmed'),
};

function fadeIn(el, display = 'flex') {
  el.style.display = display;
  el.style.opacity = '0';
  el.style.transition = 'opacity 0.85s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => el.style.opacity = '1'));
}

function fadeOut(el, cb) {
  el.style.transition = 'opacity 0.75s ease';
  el.style.opacity = '0';
  setTimeout(() => { el.style.display = 'none'; if (cb) cb(); }, 750);
}

window.addEventListener('DOMContentLoaded', () => {
  Object.values(S).forEach(el => { if (el) el.style.display = 'none'; });
  if (S.loading) { S.loading.style.display = 'flex'; S.loading.style.opacity = '1'; }
  document.addEventListener('click', tryAutoPlay, { once: true });
  setTimeout(() => fadeOut(S.loading, loadPhotos), 3000);
});

/* ── ANIMATED OPENER (no images) ── */
function loadPhotos() {
  showOpener();
}

function showOpener() {
  fadeIn(S.slideshow, 'flex');
  setTimeout(() => {
    document.getElementById('opener-text').classList.add('visible');
  }, 200);
  setTimeout(() => fadeOut(S.slideshow, showTitleScreen), 4000);
}

/* ── TITLE SCREEN ── */
function showTitleScreen() {
  fadeIn(S.title);
  setTimeout(() => document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible')), 150);
  startCountdown();
}

function startCountdown() {
  function tick() {
    const diff = BIRTHDAY - new Date();
    if (diff <= 0) { ['cd-days','cd-hrs','cd-mins','cd-secs'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '00'; }); return; }
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('cd-days', Math.floor(diff / 86400000));
    set('cd-hrs',  String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0'));
    set('cd-mins', String(Math.floor((diff % 3600000)  / 60000)).padStart(2,'0'));
    set('cd-secs', String(Math.floor((diff % 60000)    / 1000)).padStart(2,'0'));
  }
  tick(); setInterval(tick, 1000);
}

/* ── SHOW ENVELOPE ── */
function showEnvelope() {
  fadeIn(S.invitation, 'flex');
}

/* ── OPEN ENVELOPE (wax seal click) ── */
function openEnvelope() {
  const box   = document.getElementById('env-box');
  const hint  = document.getElementById('seal-hint');
  const letter = document.getElementById('env-letter');

  box.classList.add('opening');
  if (hint) hint.style.opacity = '0';

  // After flap animation, hide envelope and show letter
  setTimeout(() => {
    const scene = document.getElementById('env-scene');
    if (scene) { scene.style.transition = 'opacity 0.5s'; scene.style.opacity = '0'; }
    setTimeout(() => {
      if (scene) scene.style.display = 'none';
      letter.style.display = 'block';
      requestAnimationFrame(() => requestAnimationFrame(() => letter.classList.add('visible')));
    }, 500);
  }, 900);
}

/* ── NETLIFY SUBMIT HELPER ── */
function netlifySubmit(formName, data) {
  const body = new URLSearchParams({ 'form-name': formName, ...data });
  fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() }).catch(() => {});
}

/* ── RSVP YES ── */
function confirmRSVP() {
  const guestName = (document.getElementById('guest-name-input') || {}).value || '';
  try { saveState({ rsvp: 'yes', guest_name: guestName }); } catch {}
  netlifySubmit('rsvp', { 'guest-name': guestName, rsvp: 'yes' });
  if (typeof startMusicAfterInteraction === 'function') startMusicAfterInteraction();
  fadeOut(S.invitation);
  fadeOut(S.title);
  setTimeout(() => { fadeIn(S.confirmed); launchConfetti(); }, 400);
}

/* ── RSVP NO ── */
function declineRSVP() {
  try { saveState({ rsvp: 'no' }); } catch {}
  fadeOut(S.invitation, () => { window.location.href = 'cant-make-it.html'; });
}

/* ── CONFETTI ── */
function launchConfetti() {
  const colors = ['#D8B36A','#6B1F3A','#F6D6DE','#6F8F72','#EDE4D7','#B4ACA3'];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      const dur = 2.5 + Math.random() * 2.5;
      p.style.animationDuration = dur + 's';
      p.style.animationDelay = (Math.random() * 0.8) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), (dur + 1) * 1000);
    }, i * 35);
  }
}

/* ── AUDIO ── */
let playing = false;
function tryAutoPlay() {
  const audio = document.getElementById('bg-audio');
  if (!audio) return;
  audio.volume = 0.35;
  audio.play().then(() => {
    playing = true;
    const label = document.getElementById('music-label');
    if (label) label.textContent = '🔊';
  }).catch(() => {});
}

function toggleMusic() {
  const audio = document.getElementById('bg-audio');
  const btn   = document.getElementById('music-btn');
  const label = document.getElementById('music-label');
  if (!audio) return;
  if (playing) {
    audio.pause(); playing = false;
    if (btn) btn.classList.remove('playing');
    if (label) label.textContent = '🔇';
  } else {
    audio.play().then(() => {
      playing = true;
      if (btn) btn.classList.add('playing');
      if (label) label.textContent = '🔊';
    }).catch(() => {});
  }
}
