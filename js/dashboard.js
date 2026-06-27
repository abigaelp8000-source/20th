const BIRTHDAY = new Date('2026-07-24T00:00:00');

window.addEventListener('DOMContentLoaded', () => {
  startDashCountdown();
  loadGuestContext();
});

function dismissWelcome() {
  const modal = document.getElementById('welcome-modal');
  modal.classList.add('hidden');
  setTimeout(() => modal.style.display = 'none', 700);
}

function startDashCountdown() {
  function tick() {
    const diff = BIRTHDAY - new Date();
    if (diff <= 0) {
      document.getElementById('dd-days').textContent = '🎂';
      document.getElementById('dd-hrs').textContent  = 'It';
      document.getElementById('dd-mins').textContent = 'Here';
      return;
    }
    document.getElementById('dd-days').textContent = Math.floor(diff / 86400000);
    document.getElementById('dd-hrs').textContent  = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
    document.getElementById('dd-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
  }
  tick();
  setInterval(tick, 60000);
}

function loadGuestContext() {
  const s = getState();

  // Show guest name in hero if saved
  if (s.guest_name) {
    const t = document.getElementById('dash-greeting');
    if (t) t.textContent = 'Hey ' + s.guest_name.split(' ')[0] + '!';
  }

  // My Choices bar
  const bar = document.getElementById('my-choices');
  if (!bar) return;
  const parts = [];
  if (s.duration === 'weekend') parts.push('📅 Weekend trip · 22nd–26th July');
  else if (s.duration === 'week')    parts.push('📅 Week trip · 22nd July–1st Aug');
  else if (s.duration === 'full')    parts.push('📅 Full trip · 22nd July–9th Aug');

  if (s.transport === 'bus')    parts.push('🚌 Bus');
  else if (s.transport === 'flight') parts.push('✈️ Flight');
  else if (s.transport === 'sgr')    parts.push('🚆 SGR');

  if (s.malindi === true)  parts.push('🌴 Malindi: Yes');
  else if (s.malindi === false) parts.push('🌴 Malindi: Not joining');

  const acts = (s.watamu_activities || []).length;
  if (acts > 0) parts.push('⛵ ' + acts + ' activit' + (acts === 1 ? 'y' : 'ies') + ' selected');

  if (parts.length) {
    bar.innerHTML = parts.map(p => `<span class="choice-chip">${p}</span>`).join('');
    bar.parentElement.style.display = 'block';
  }

  // Guestbook count on card
  const gbCount = (s.guestbook || []).length;
  const gbSub = document.getElementById('gb-card-sub');
  if (gbSub && gbCount > 0) gbSub.textContent = gbCount + ' message' + (gbCount === 1 ? '' : 's') + ' so far';

  // Playlist count
  const plCount = (s.playlist || []).length;
  const plSub = document.getElementById('pl-card-sub');
  if (plSub && plCount > 0) plSub.textContent = plCount + ' song' + (plCount === 1 ? '' : 's') + ' added';
}
