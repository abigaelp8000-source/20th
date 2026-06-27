/* ================================================
   TWENTY IN PARADISE — Main JS
   ================================================ */

// ── BIRTHDAY: July 24 2026 ──
const BIRTHDAY = new Date('2026-07-24T00:00:00');

// ── SCREEN REFS ──
const screens = {
  loading:    document.getElementById('screen-loading'),
  slideshow:  document.getElementById('screen-slideshow'),
  title:      document.getElementById('screen-title'),
  invitation: document.getElementById('screen-invitation'),
  confirmed:  document.getElementById('screen-confirmed'),
};

// ── UTILITY ──
function show(el) {
  el.classList.remove('hidden');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('active'));
  });
}
function hide(el) {
  el.classList.remove('active');
  setTimeout(() => el.classList.add('hidden'), 900);
}
function fadeOut(el, cb) {
  el.style.opacity = '0';
  el.style.transition = 'opacity 0.8s ease';
  setTimeout(() => { el.classList.add('hidden'); if (cb) cb(); }, 800);
}

// ── STEP 1: LOADING → SLIDESHOW ──
window.addEventListener('DOMContentLoaded', () => {
  screens.loading.classList.add('active');

  setTimeout(() => {
    fadeOut(screens.loading, () => {
      screens.loading.style.display = 'none';
      startSlideshow();
    });
  }, 3000);
});

// ── STEP 2: SLIDESHOW ──
function startSlideshow() {
  const ss = screens.slideshow;
  ss.classList.remove('hidden');
  ss.style.opacity = '0';
  ss.style.transition = 'opacity 0.9s ease';
  ss.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => ss.style.opacity = '1'));

  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0;

  const timer = setInterval(() => {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current++;

    if (current >= slides.length) {
      clearInterval(timer);
      setTimeout(() => {
        ss.style.opacity = '0';
        setTimeout(() => {
          ss.style.display = 'none';
          showTitleScreen();
        }, 900);
      }, 1200);
      return;
    }

    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }, 1800);
}

// ── STEP 3: TITLE SCREEN ──
function showTitleScreen() {
  const ts = screens.title;
  ts.classList.remove('hidden');
  ts.style.opacity = '0';
  ts.style.display = 'flex';
  ts.style.transition = 'opacity 0.9s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => ts.style.opacity = '1'));

  // Trigger fade-up animations
  setTimeout(() => {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
  }, 200);

  startCountdown();
}

// ── COUNTDOWN ──
function startCountdown() {
  function tick() {
    const now  = new Date();
    const diff = BIRTHDAY - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '0';
      document.getElementById('cd-hrs').textContent  = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    document.getElementById('cd-days').textContent = d;
    document.getElementById('cd-hrs').textContent  = String(h).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

// ── STEP 4: INVITATION ──
function showInvitation() {
  screens.invitation.classList.remove('hidden');
}

// ── RSVP: YES ──
function confirmRSVP() {
  screens.invitation.classList.add('hidden');
  screens.title.style.opacity = '0';
  setTimeout(() => screens.title.classList.add('hidden'), 900);

  const conf = screens.confirmed;
  conf.classList.remove('hidden');
  conf.style.display = 'flex';
  conf.style.opacity = '0';
  conf.style.transition = 'opacity 0.9s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => conf.style.opacity = '1'));

  launchConfetti();
}

// ── RSVP: NO ──
function declineRSVP() {
  screens.invitation.classList.add('hidden');

  // Show a soft decline message then let them browse the title screen
  const msg = document.createElement('div');
  msg.style.cssText = `
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
    background: #FAF8F5; border: 1px solid #EDE4D7;
    padding: 18px 32px; font-family: 'Cormorant Garamond', serif;
    font-size: 16px; color: #6B1F3A; text-align: center;
    z-index: 99; animation: slideUpAnim 0.5s ease;
    max-width: 90vw;
  `;
  msg.innerHTML = `Thank you so much for taking the time to view my invitation.<br>You'll definitely be missed, but I appreciate you. ❤️`;
  document.body.appendChild(msg);
  setTimeout(() => { msg.style.opacity = '0'; msg.style.transition = 'opacity 0.6s'; setTimeout(() => msg.remove(), 600); }, 5000);
}

// ── CONFETTI ──
function launchConfetti() {
  const colors = ['#D8B36A','#6B1F3A','#F6D6DE','#6F8F72','#EDE4D7','#B4ACA3'];
  const container = document.getElementById('confetti-container');

  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left     = Math.random() * 100 + 'vw';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      const dur = 2.5 + Math.random() * 2.5;
      p.style.animationDuration = dur + 's';
      p.style.animationDelay   = (Math.random() * 0.8) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), (dur + 1) * 1000);
    }, i * 35);
  }
}
