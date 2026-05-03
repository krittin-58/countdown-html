# countdown-html

A minimal, full-screen countdown timer that runs entirely in the browser — no build step, no dependencies.

## Features

### Timers
- **Multiple timers** — run several countdowns side-by-side in a responsive grid
- **Pause / Resume** — freeze any individual timer and continue exactly where it left off
- **Pause All / Resume All** — single buttons to control every timer at once
- **Preset durations** — built-in buttons for 5 m, 10 m, 15 m, 25 m (Pomodoro 🍅), 45 m, plus **saveable custom presets**
- **Timer names** — label each timer (e.g. "Meeting", "Lunch break")
- **Count-up mode** — after reaching zero the display switches to +MM:SS to show elapsed overtime
- **Auto-repeat / Loop** — enable per-timer to automatically restart after each cycle
- **Pomodoro counter** — 🍅 badges accumulate for every completed cycle
- **Timer chain** — "Then start" option links timers so one starts automatically when another finishes
- **Countdown to datetime** — switch the add form to "Until" mode and pick a target date/time

### Visuals
- **Progress bar** — visual fill showing time remaining vs. total
- **Urgent mode** — when < 60 s remain the display switches to seconds-only in large red text
- **Per-timer accent color** — a color picker inside each card's ⚙ options
- **Drag-to-reorder** — drag timer cards to rearrange them
- **Themes** — Dark, Ocean, Sunset, Forest, Purple, Light; auto-selects Light if the OS is in light mode
- **Current time clock** — live HH:MM:SS in the top-right corner
- **Active timer highlight** — the focused card gets an accent-colored outline

### Sound & Notifications
- **Beep alert** — three-tone beep via Web Audio API when a timer reaches zero
- **Mute toggle** — silence all beeps with one click (🔊 / 🔇)
- **Waveform selector** — choose sine, square, sawtooth, or triangle
- **Volume slider** — adjust beep loudness
- **Browser Notifications** — opt-in desktop notification when a timer ends (works even when the tab is in the background)

### UX & Sharing
- **Keyboard shortcuts** — see table below
- **Wake Lock** — requests the Screen Wake Lock API to prevent the screen from sleeping while timers are running
- **Share URL** — 🔗 button copies a URL with all current timer configs to the clipboard
- **Export / Import JSON** — 📋 button opens an editor to copy/paste full timer state as JSON
- **URL parameters** — deep-link to a pre-configured timer (see below)
- **Persistent state** — timers survive page refreshes via `localStorage`
- **PWA / installable** — add to home screen on mobile or install on desktop for offline use
- **Smart TV support** — falls back to a file-based `localStorage` shim on Samsung Smart TVs

## Usage

Open `index.html` in any modern browser (or serve the folder from a local HTTP server for full PWA and Wake Lock support).

| Action | How |
|--------|-----|
| Add a timer | Click **＋ ADD**, fill in name/minutes or click a preset, then **▶ START** |
| Add timer until a time | Click **＋ ADD → 📅 Until**, pick a target date/time |
| Pause / Resume | Click **⏸ PAUSE** / **▶ RESUME** on the card, or press **Space** |
| Pause / Resume all | Click **⏸ ALL** / **▶ ALL** |
| Reset a timer | Click **↺ RESET** or press **R** |
| Remove a timer | Click **✕** or press **Delete** |
| Timer options | Click **⚙** on a card to set color, auto-repeat, and chain-to |
| Drag to reorder | Drag any timer card to a new position |
| Hide controls | Click **HIDE**, or click any timer display |
| Show controls | Click anywhere while hidden |
| Fullscreen | Click **⛶ FS** or press **F** |
| Change theme | Use the theme dropdown |
| Enable notifications | Click **🔔** and allow in the browser prompt |
| Share timers | Click **🔗** to copy a shareable URL |
| Export / Import | Click **📋** then **📤 Export** or paste JSON and click **📥 Import** |
| Save a custom preset | Set name + minutes, click **💾 Save** in the add form |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Pause / Resume the active timer |
| **R** | Reset the active timer |
| **Delete** | Remove the active timer |
| **F** | Toggle fullscreen |
| **Escape** | Close add form, or toggle controls |
| **← / →** | Cycle the active timer between cards |

## URL Parameters

Start a timer automatically by passing query parameters:

```
index.html?minutes=25&name=Pomodoro
```

| Parameter | Description |
|-----------|-------------|
| `minutes` | Duration in minutes (decimals allowed, e.g. `1.5`) |
| `name`    | Optional label for the timer |

## Share URL

The **🔗 SHARE** button generates a URL like:

```
index.html#share=[{"name":"Pomodoro","totalMs":1500000,...}]
```

Opening that URL restores all shared timers (name, duration, color, repeat setting).
