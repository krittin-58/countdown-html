# countdown-html

A minimal, full-screen countdown timer that runs entirely in the browser — no build step, no dependencies.

## Features

- **Multiple timers** — run several countdowns side-by-side in a responsive grid
- **Pause / Resume** — freeze any individual timer and continue exactly where it left off
- **Preset durations** — one-click buttons for 5 m, 10 m, 15 m, 25 m (Pomodoro 🍅), and 45 m
- **Timer names** — label each timer (e.g. "Meeting", "Lunch break")
- **Progress bar** — visual fill showing time remaining vs. total
- **Urgent mode** — when < 60 s remain, the display switches to seconds-only in large red text
- **Beep alert** — three-tone beep via Web Audio API when a timer reaches zero
- **Fullscreen** — one click to enter / exit browser fullscreen mode
- **Themes** — choose from Dark, Ocean, Sunset, Forest, or Purple
- **URL parameters** — deep-link to a pre-configured timer (see below)
- **Persistent state** — active timers survive a page refresh via `localStorage`
- **Smart TV support** — falls back to a file-based `localStorage` shim on Samsung Smart TVs

## Usage

Open `index.html` in any modern browser.

| Action | How |
|--------|-----|
| Add a timer | Click **＋ ADD**, fill in name/minutes or click a preset, then **▶ START** |
| Pause / Resume | Click **⏸ PAUSE** or **▶ RESUME** on any timer card |
| Reset a timer | Click **↺ RESET** on the timer card |
| Remove a timer | Click **✕** on the timer card |
| Hide controls | Click **HIDE** in the control panel, or click any timer display |
| Show controls | Click anywhere on the page while hidden |
| Fullscreen | Click **⛶ FS** |
| Change theme | Use the dropdown in the control panel |

## URL Parameters

Start a timer automatically by passing query parameters:

```
index.html?minutes=25&name=Pomodoro
```

| Parameter | Description |
|-----------|-------------|
| `minutes` | Duration in minutes (decimals allowed, e.g. `1.5`) |
| `name`    | Optional label for the timer |
