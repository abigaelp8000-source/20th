/* ================================================
   TWENTY IN PARADISE — Main JS
   ================================================ */

const BIRTHDAY = new Date('2026-07-24T00:00:00');

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
  // Show loading immediately
  S.loading.style.display = 'flex';
  S.loading.style.opacity = '1';

  // Hide everything else
  S.slideshow.style.display  = 'none';
  S.title.style.display      = 'none';
  S.invitation.style.display = 'none';
  S.confirmed.style.display  = 'none';

  setTimeout(() => fadeOut(S.loading, startSlideshow), 3000);
});

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
  }, 1800);
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
  fadeOut(S.invitation);
  fadeOut(S.title);
  setTimeout(() => {
    fadeIn(S.confirmed);
    launchConfetti();
  }, 400);
}

// ── RSVP NO ──
function declineRSVP() {
  fadeOut(S.invitation);
  const msg = document.createElement('div');
  msg.style.cssText = `
    position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
    background:#FAF8F5; border:1px solid #EDE4D7;
    padding:18px 32px; font-family:'Cormorant Garamond',serif;
    font-size:16px; color:#6B1F3A; text-align:center;
    z-index:999; max-width:90vw; line-height:1.7;
    animation: slideUpAnim 0.5s ease;
  `;
  msg.innerHTML = `Thank you so much for taking the time to view my invitation.<br>You'll definitely be missed, but I appreciate you. ❤️`;
  document.body.appendChild(msg);
  setTimeout(() => { msg.style.opacity='0'; msg.style.transition='opacity 0.6s'; setTimeout(()=>msg.remove(),600); }, 5000);
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

// ── MUSIC (index page) ──
let playing = false;
function toggleMusic() {
  const audio = document.getElementById('bg-audio');
  const btn   = document.getElementById('music-btn');
  const label = document.getElementById('music-label');
  if (!audio || audio.error) return;
  if (playing) {
    audio.pause(); playing = false;
    btn.classList.remove('playing'); label.textContent = 'Music';
  } else {
    audio.play().then(() => {
      playing = true; btn.classList.add('playing'); label.textContent = 'Playing';
    }).catch(() => {});
  }
}
