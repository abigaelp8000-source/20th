/* ================================================
   TWENTY IN PARADISE — Main JS
   ================================================ */

const BIRTHDAY = new Date('2026-07-23T00:00:00');
const GITHUB_PHOTOS = 'https://api.github.com/repos/abigaelp8000-source/20th/contents/assets/photos';

// ── SCREEN REFS ──
const S = {
  loading:    document.getElementById('screen-loading'),
  slideshow:  document.getElementById('screen-slideshow'),
  title:      document.getElementById('screen-title'),
  invitation: document.getElementById('screen-invitation'),
  confirmed:  document.getElementById('screen-confirmed'),
};

// ── HELPERS ──
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

// ── BOOT ──
window.addEventListener('DOMContentLoaded', () => {
  S.loading.style.display = 'flex';
  S.loading.style.opacity = '1';
  S.slideshow.style.display  = 'none';
  S.title.style.display      = 'none';
  S.invitation.style.display = 'none';
  S.confirmed.style.display  = 'none';

  // Auto-play audio on first interaction
  document.addEventListener('click', tryAutoPlay, { once: true });

  setTimeout(() => fadeOut(S.loading, () => loadPhotos()), 3000);
});

// ── PHOTO LOADING (GitHub API) ──
function loadPhotos() {
  fetch(GITHUB_PHOTOS)
    .then(r => r.json())
    .then(files => {
      const photos = Array.isArray(files)
        ? files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name))
        : [];
      buildSlideshow(photos.length ? photos.map(f => f.download_url) : null);
    })
    .catch(() => buildSlideshow(null));
}

function buildSlideshow(urls) {
  const frame = document.getElementById('slide-frame');
  const dotsEl = document.getElementById('slide-dots');
  frame.innerHTML = '';
  dotsEl.innerHTML = '';

  // Fallback: use local assets/photos if API fails / no photos
  const sources = urls || [
    'assets/photos/01.jpg','assets/photos/02.jpg','assets/photos/03.jpg',
    'assets/photos/04.jpg','assets/photos/05.jpg','assets/photos/06.jpg',
    'assets/photos/07.jpg','assets/photos/08.jpg','assets/photos/09.jpg',
    'assets/photos/10.jpg'
  ];

  sources.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 0 ? ' active' : '');
    const ph = document.createElement('div');
    ph.className = 'slide-ph' + (i === sources.length - 1 ? ' current' : '');
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    // if image fails, show palm emoji placeholder
    img.onerror = () => { img.style.display='none'; fb.style.display='flex'; };
    const fb = document.createElement('div');
    fb.className = 'slide-fallback';
    fb.style.display = 'none';
    fb.textContent = '🌴';
    ph.appendChild(img);
    ph.appendChild(fb);
    slide.appendChild(ph);
    frame.appendChild(slide);

    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(dot);
  });

  startSlideshow();
}

// ── SLIDESHOW ──
function startSlideshow() {
  fadeIn(S.slideshow);

  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0;

  const timer = setInterval(() => {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current++;

    if (current >= slides.length) {
      clearInterval(timer);
      setTimeout(() => fadeOut(S.slideshow, showTitleScreen), 1000);
      return;
    }

    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }, 2000);
}

// ── TITLE SCREEN ──
function showTitleScreen() {
  fadeIn(S.title);
  setTimeout(() => {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
  }, 150);
  startCountdown();
}

// ── COUNTDOWN ──
function startCountdown() {
  function tick() {
    const diff = BIRTHDAY - new Date();
    if (diff <= 0) {
      ['cd-days','cd-hrs','cd-mins','cd-secs'].forEach(id => document.getElementById(id).textContent = '00');
      return;
    }
    document.getElementById('cd-days').textContent = Math.floor(diff / 86400000);
    document.getElementById('cd-hrs').textContent  = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
    document.getElementById('cd-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
    document.getElementById('cd-secs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}

// ── INVITATION ──
function showInvitation() {
  fadeIn(S.invitation);
}

// ── RSVP YES ──
function confirmRSVP() {
  try { localStorage.setItem('paradise_2026', JSON.stringify({ ...JSON.parse(localStorage.getItem('paradise_2026') || '{}'), rsvp: 'yes' })); } catch {}
  fadeOut(S.invitation);
  fadeOut(S.title);
  setTimeout(() => {
    fadeIn(S.confirmed);
    launchConfetti();
  }, 400);
}

// ── RSVP NO ──
function declineRSVP() {
  try { localStorage.setItem('paradise_2026', JSON.stringify({ ...JSON.parse(localStorage.getItem('paradise_2026') || '{}'), rsvp: 'no' })); } catch {}
  fadeOut(S.invitation, () => {
    window.location.href = 'cant-make-it.html';
  });
}

// ── CONFETTI ──
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

// ── MUSIC ──
let playing = false;
function tryAutoPlay() {
  const audio = document.getElementById('bg-audio');
  if (!audio) return;
  audio.volume = 0.4;
  audio.play().then(() => {
    playing = true;
    const btn = document.getElementById('music-btn');
    const label = document.getElementById('music-label');
    if (btn) btn.classList.add('playing');
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
