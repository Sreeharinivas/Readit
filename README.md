# ReadIt - OCR & Reading Assistant

ReadIt is an AI-powered OCR reading and accessibility web application designed to help people with low vision, dyslexia, or reading difficulty consume printed or on-screen text.

## Features

- **Capture**: Take a picture with your device camera or upload an image.
- **OCR**: Instantly extract text from images using Tesseract.js running entirely in your browser.
- **Simplify**: Simulate LLM-powered text simplification and noise reduction to make content clearer.
- **Listen & Read**: Hero reading screen featuring large text, word-by-word highlighting synced with speech, and playback controls.
- **History & Bookmarks**: Automatically saves your past captures locally so you can revisit them anytime.
- **Personalization**: Adjustable text size, reading speed, light/dark themes, and an OpenDyslexic font toggle.
- **Export**: Export text for external use.

## Architecture & Tech Stack

- **Framework**: React 18 with TypeScript and Vite.
- **Styling**: Tailwind CSS v3 with a custom "Warm Sand" theme, extended type scale, and Framer Motion for purposeful, eased transitions.
- **State Management**: React Context (`SettingsContext`, `HistoryContext`) backed by `localStorage`.
- **OCR Engine**: Tesseract.js (client-side).
- **TTS Engine**: Web Speech API (`SpeechSynthesis`).

## Design Identity

- **Palette**: Warm Sand theme, prioritizing calm, high-trust colors rather than clinical or generic software aesthetics.
- **Typography**: "Outfit" (display), "Inter" (UI), and "OpenDyslexic" (accessibility toggle).
- **Motion**: Every state transition uses intentional, smooth animation (e.g., skeletons for loading states, layout animations in history).

## Setup & Running

This project uses `npm` and requires Node.js.

```bash
npm install
npm run dev
```

The app is fully functional in mock mode without API keys (OCR is done locally via WASM, and AI simplification is simulated with a timeout). 

## Known Limitations

1. **Audio Export**: The Web Speech API does not natively support routing synthesized speech into a `MediaRecorder` stream consistently across browsers. Therefore, only text export is currently supported. A cloud-based TTS provider (like OpenAI TTS or ElevenLabs) would be required to generate downloadable audio files reliably.
2. **Offline Mode**: While basic OCR works offline via Tesseract.js once its WebAssembly files are cached, a true PWA service worker is not yet implemented in this prototype. The "Offline Indicator" will show when network connectivity drops.
