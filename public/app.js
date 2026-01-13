// public/app.js
'use strict';

const imgEl = document.getElementById('carouselImage');
const statusEl = document.getElementById('status');
const metaEl = document.getElementById('meta');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playBtn = document.getElementById('playBtn');

let images = [];
let idx = 0;
let timer = null;
let playing = false;

function setStatus(text) {
  statusEl.textContent = text;
}

function setMeta() {
  if (!images.length) {
    metaEl.innerHTML = '';
    return;
  }
  metaEl.innerHTML = `Image <span class="kbd">${idx + 1}</span> / <span class="kbd">${images.length}</span>`;
}

function render() {
  if (!images.length) {
    imgEl.style.display = 'none';
    imgEl.alt = '';
    document.getElementById('emptyState').style.display = 'block';
    setStatus('No images found in /public/images');
    setMeta();
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    playBtn.disabled = true;
    return;
  }

  document.getElementById('emptyState').style.display = 'none';
  imgEl.style.display = 'block';
  imgEl.src = images[idx];
  imgEl.alt = `Image ${idx + 1}`;
  setStatus(`Loaded ${images.length} image(s) from /api/images`);
  setMeta();
  prevBtn.disabled = false;
  nextBtn.disabled = false;
  playBtn.disabled = false;
}

function next() {
  if (!images.length) return;
  idx = (idx + 1) % images.length;
  render();
}

function prev() {
  if (!images.length) return;
  idx = (idx - 1 + images.length) % images.length;
  render();
}

function startAuto() {
  if (timer) clearInterval(timer);
  timer = setInterval(next, 5000);
  playing = true;
  playBtn.textContent = 'Pause';
}

function stopAuto() {
  if (timer) clearInterval(timer);
  timer = null;
  playing = false;
  playBtn.textContent = 'Play';
}

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
playBtn.addEventListener('click', () => (playing ? stopAuto() : startAuto()));

// Keyboard: left/right for navigation, space to play/pause
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
  if (e.key === ' ') {
    e.preventDefault();
    playing ? stopAuto() : startAuto();
  }
});

async function boot() {
  setStatus('Loading images...');
  try {
    const res = await fetch('/api/images', { cache: 'no-store' });
    const data = await res.json();
    images = Array.isArray(data.images) ? data.images : [];
    idx = 0;
    render();
  } catch (err) {
    setStatus(`Failed to load /api/images: ${err.message || err}`);
  }
}

boot();
