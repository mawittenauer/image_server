<!-- README.md -->
# Pi Image Carousel

A tiny Node.js + Express app that serves images from a local folder and displays them in a simple browser carousel.  
Designed to run nicely on a Raspberry Pi on your home network.

## How it works

- Images live in: `public/images`
- The server exposes an endpoint: `GET /api/images` which returns a JSON list of image URLs
- The frontend (`public/index.html`) loads that list and provides:
  - Next/Prev buttons
  - Autoplay (5 seconds per image)
  - Keyboard controls: Left/Right arrows + Space to play/pause

Supported file types: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

---

## Requirements

- Node.js 18+ recommended (works with 16+ too)
- npm

On Raspberry Pi you’ll typically install Node via:
- Debian/Ubuntu package, or
- NodeSource, or
- `nvm`

---

## Setup (Development)

```bash
# 1) Create the project folder
mkdir pi-image-carousel
cd pi-image-carousel

# 2) Add the files from this README / chat output
#    (server.js, package.json, public/*)

# 3) Install deps
npm install

# 4) Add images
mkdir -p public/images
# copy .jpg/.png/etc into public/images

# 5) (Optional) env config
cp .env.example .env
# NOTE: This app doesn't require dotenv; the .env file is just a template.
# If you want automatic .env loading, add dotenv and require it in server.js.

# 6) Run
npm run dev
