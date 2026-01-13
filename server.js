// server.js
'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();

const PORT = parseInt(process.env.PORT || '3000', 10);
const IMAGE_DIR_REL = process.env.IMAGE_DIR || 'public/images';
const IMAGE_DIR_ABS = path.join(__dirname, IMAGE_DIR_REL);

// Basic hardening
app.disable('x-powered-by');

// Serve static assets (includes /images/*)
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html'],
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
}));

function isAllowedImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
}

function safeImageList() {
  // If folder doesn't exist, return empty list (avoid crashing)
  if (!fs.existsSync(IMAGE_DIR_ABS)) return [];

  const entries = fs.readdirSync(IMAGE_DIR_ABS, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter(isAllowedImage)
    // stable order
    .sort((a, b) => a.localeCompare(b));

  // Convert to web paths (relative to /public)
  // Example: IMAGE_DIR_REL = "public/images" -> web path "/images/<file>"
  const relFromPublic = IMAGE_DIR_REL.replace(/^public[\\/]/, '').replace(/^public$/, '');
  const prefix = relFromPublic ? `/${relFromPublic}` : '';
  return files.map((f) => `${prefix}/${encodeURIComponent(f)}`);
}

app.get('/api/images', (_req, res) => {
  const images = safeImageList();
  res.json({
    count: images.length,
    images,
  });
});

// Optional health check for systemd/reverse proxy setups
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

app.listen(PORT, () => {
  console.log(`Carousel app listening on http://localhost:${PORT}`);
  console.log(`Serving images from: ${IMAGE_DIR_REL}`);
});
