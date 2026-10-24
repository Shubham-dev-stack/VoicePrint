# Voiceprint 🎙️
> **Your identity. Your voice.**

**Voiceprint** is a personal voice communication app designed for the hackathon. It allows users to type messages in English, Hindi, or conversational Hinglish and hear them spoken in verified vocal personas powered by the real **Fish Audio Text-to-Speech API** (`s2.1-pro-free` model), with automatic local browser speech fallback when offline.

---

## 🔒 Security Architecture

- **Backend-Only Credentials:** The Fish Audio API key (`FISH_API_KEY`) is stored exclusively in `server/.env` and loaded via `process.env.FISH_API_KEY`.
- **Zero Client Leakage:** API keys are never bundled in Vite client files, never exposed in client requests/responses, and never committed to Git (enforced via `.gitignore`).
- **Proxy Architecture:** Frontend requests are proxied via `/api/tts` through a lightweight Node.js + Express backend running on port 3001.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- **Audio Playback:** HTML5 Audio (streaming Fish Audio MP3) + Web Speech API (fallback) + Canvas Waveform Visualizer
- **Backend:** Node.js, Express, TypeScript, CORS, Dotenv
- **TTS Engine:** Fish Audio API (`https://api.fish.audio/v1/tts`) with `s2.1-pro-free` model

---

## 🚀 Getting Started

### 1. Install Dependencies

Install root (frontend) and server (backend) packages:
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment (`server/.env`)

Copy `server/.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```
Edit `server/.env` with your Fish Audio API credentials:
```env
FISH_API_KEY=sk-fish-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FISH_AUDIO_MODEL=s2.1-pro-free
PORT=3001
```

> [!NOTE]
> `server/.env` is ignored by git to protect credentials. Never commit your API key.

### 3. Run Development Servers

Open two terminal windows:

**Terminal 1 — Backend Proxy (Port 3001):**
```bash
npm run server
# Or for live tsx watching:
npm run server:dev
```

**Terminal 2 — Frontend App (Port 5173):**
```bash
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 🔌 Backend Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/status` | `GET` | Returns backend health and whether `FISH_API_KEY` is loaded (never reveals key) |
| `/api/voices` | `GET` | Returns verified Fish Audio public voice models with tags |
| `/api/tts` | `POST` | Validates text (1-1000 chars) and calls `https://api.fish.audio/v1/tts`, returning MP3 audio bytes |

### Example `POST /api/tts` Request:
```json
{
  "text": "Hello, how can I help? Main yahan hoon aapki help karne ke liye.",
  "reference_id": "802e3bc2b27e49c2995d23ef70e6ac89"
}
```
**Response:** Binary stream with header `Content-Type: audio/mpeg`.

---

## 🎙️ Verified Public Voice Models

Voiceprint connects to verified public voice models on Fish Audio:

| Voice | Persona | Fish Audio Model ID | Languages |
| :--- | :--- | :--- | :--- |
| **Aarav** | Clear & Energetic | `802e3bc2b27e49c2995d23ef70e6ac89` | English |
| **Ananya** | Natural English (Sarah) | `933563129e564b19a115bedd57b7406a` | English |
| **Priya** | Conversational Hinglish | `4d7609058bd34213b1378b29efbde1f1` | Hindi, Hinglish |
| **Kabir** | Resonant Hindi | `2e88923b8e4c4b49b9595397d7d6ccbc` | Hindi, English |
| **Meera** | Bilingual Professional | `1600f0a2e2af4ef3af1b350367683ede` | English, Hindi |
| **Rohan** | Lively Hindi | `528f686ef2154885b368dd4b93fb8728` | Hindi |
| **Elena** | Studio Transatlantic | `711cf3ed00ab441a8f54a45058047b7a` | English |

---

## 📦 Production Build

```bash
# Build frontend
npm run build

# Build backend
npm run server:build
```
