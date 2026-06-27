/* TWENTY IN PARADISE — Shared State */
const PARADISE_KEY = 'paradise_2026';

function getState() {
  try { return JSON.parse(localStorage.getItem(PARADISE_KEY)) || {}; }
  catch { return {}; }
}

function saveState(updates) {
  const s = { ...getState(), ...updates };
  localStorage.setItem(PARADISE_KEY, JSON.stringify(s));
  return s;
}

function getVal(key, fallback = null) {
  return getState()[key] ?? fallback;
}

function toggleArrayItem(key, value) {
  const arr = getVal(key, []);
  const idx = arr.indexOf(value);
  if (idx === -1) arr.push(value);
  else arr.splice(idx, 1);
  saveState({ [key]: arr });
  return arr;
}
