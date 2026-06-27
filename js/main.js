/* TWENTY IN PARADISE — Main JS */

const BIRTHDAY = new Date('2026-07-24T00:00:00');
const GITHUB_PHOTOS = 'https://api.github.com/repos/abigaelp8000-source/20th/contents/intro?ref=feature/full-website-build';

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

/* ── PHOTO LOADING ── */
function loadPhotos() {
  fetch(GITHUB_PHOTOS)
    .then(r => r.json())
    .then(files => {
      const photos = Array.isArray(files)
        ? files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name)).map(f => f.download_url)
        : [];
      buildSlideshow(photos.length ? photos : null);
    })
    .catch(() => buildSlideshow(null));
}

function buildSlideshow(urls) {
  const frame = document.getElementById('slide-frame');
  const dotsEl = document.getElementById('slide-dots');
  frame.innerHTML = '';
  dotsEl.innerHTML = '';

  const sources = urls || [
    'assets/photos/01.jpg','assets/photos/02.jpg','assets/photos/03.jpg',
    'assets/photos/04.jpg','assets/photos/05.jpg',
  ];

  sources.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 0 ? ' active' : '');
    const img = document.createElement('img');
    img.src = src; img.alt = '';
    const fb = document.createElement('div');
    fb.className = 'slide-fallback';
    fb.textContent = '🌴';
    img.onerror = () => { img.style.display = 'none'; fb.style.display = 'flex'; };
    slide.appendChild(img); slide.appendChild(fb);
    frame.appendChild(slide);

    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.style.cssText = 'width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.4);display:inline-block;transition:background 0.3s';
    dotsEl.appendChild(dot);
  });

  startSlideshow(sources.length);
}

function startSlideshow(total) {
  fadeIn(S.slideshow, 'block');
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('#slide-dots .dot');
  let current  = 0;
  const msPerSlide = Math.floor(10000 / total); // 10 seconds total

  const timer = setInterval(() => {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].style.background = 'rgba(255,255,255,0.4)';
    current++;
    if (current >= slides.length) {
      clearInterval(timer);
      setTimeout(() => fadeOut(S.slideshow, showTitleScreen), 800);
      return;
    }
    slides[current].classList.add('active');
    if (dots[current]) dots[current].style.background = 'rgba(255,255,255,0.9)';
    // Restart zoom animation
    const img = slides[current].querySelector('img');
    if (img) { img.style.animation = 'none'; requestAnimationFrame(() => img.style.animation = ''); }
  }, msPerSlide);
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

/* ── RSVP YES ── */
function confirmRSVP() {
  try { saveState({ rsvp: 'yes' }); } catch {}
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
