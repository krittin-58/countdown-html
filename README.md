# countdown-html

A full-screen countdown timer that runs entirely in the browser — no build step, no dependencies.

## Features

### Timers
- **Multiple timers** — run several countdowns side-by-side in a responsive grid
- **Pause / Resume** — freeze any individual timer and continue exactly where it left off
- **Preset durations** — built-in 5 m, 10 m, 15 m, 25 m 🍅, 45 m; plus **save your own custom presets**
- **Timer names** — label each timer (e.g. "Meeting", "Lunch break")
- **Timer Sets** — save and restore groups of timers (e.g. a full workshop schedule)
- **Progress bar** — visual fill showing time remaining vs. total
- **Urgent mode** — when < 60 s remain, the display switches to seconds-only in large red text
- **Persistent state** — timers survive a page refresh via `localStorage`

### Productivity
- **🍅 Pomodoro Session Manager** — auto-cycles Work → Short Break → Work → Long Break with round counter
- **↕ Sequential Mode** — automatically starts the next timer when the current one finishes
- **📊 Session History** — logs every completed timer; shows today's total focus time

### Notifications & Audio
- **Browser Notifications** — get a desktop alert when a timer finishes, even in a background tab
- **Alarm sounds** — choose from Beep (default), Bell, Chime, or Silent
- **Volume control** — adjust the alarm volume with a slider

### Visual
- **Themes** — Dark, Light, Ocean, Sunset, Forest, Purple
- **⊙ Clock** — toggle a live clock alongside your timers
- **Font size slider** — scale up timer digits for projectors or large displays
- **Fullscreen** — one click to enter / exit

### Sharing & Integration
- **🔗 Share URL** — encode all current timers into a URL to share with others
- **iframe embed** — ready-made `<iframe>` snippet for embedding in any web page
- **OBS Browser Source** — transparent-background mode for streaming overlays
- **PWA** — install as a standalone app; works fully offline

### Keyboard shortcuts
| Key | Action |
|-----|--------|
| `Space` | Pause / Resume the first active timer |
| `N` | Open the Add Timer form |
| `R` | Reset the first timer |
| `F` | Toggle fullscreen |
| `Esc` | Close modal / hide controls |

### Accessibility
- ARIA labels and roles on all interactive elements
- `aria-live` regions for timer displays and clock
- Progress bars with `role="progressbar"` and `aria-valuenow`

### Smart TV
- Falls back to a file-based `localStorage` shim on Samsung Smart TVs

## Usage

Open `index.html` in any modern browser (or install it as a PWA).

| Action | How |
|--------|-----|
| Add a timer | Click **＋ ADD**, fill in name / minutes or click a preset, then **▶ START** |
| Save a custom preset | Fill in name + minutes, click **💾** next to START |
| Pause / Resume | Click **⏸ PAUSE** / **▶ RESUME** on any timer card |
| Reset | Click **↺ RESET** on the timer card |
| Remove | Click **✕** on the timer card |
| Save timer set | Click **⊞ SETS → 💾 Save Current Set** |
| Load timer set | Click **⊞ SETS**, then click a saved set name |
| Start Pomodoro | Click **🍅 POMO** |
| Sequential mode | Click **↕ SEQ** — next timer starts automatically |
| Hide controls | Click **HIDE**, or click any timer display |
| Show controls | Click anywhere on the page while hidden |
| Fullscreen | Click **⛶ FS** |
| Change theme | Use the theme dropdown |
| Change sound / volume | Use the sound dropdown and 🔊 slider |
| Adjust font size | Use the **Aa** slider |
| View history | Click **📊 STATS** |
| Share / Embed | Click **🔗 SHARE** |

## URL Parameters

### Legacy query-string (single timer)
```
index.html?minutes=25&name=Pomodoro
```

| Parameter | Description |
|-----------|-------------|
| `minutes` | Duration in minutes (decimals allowed, e.g. `1.5`) |
| `name`    | Optional label for the timer |

### Hash-based routing (multi-timer / OBS)

Generated automatically by the **🔗 SHARE** button.

```
index.html#timers=[{"n":"Work","m":25},{"n":"Break","m":5}]
index.html#timers=[{"n":"Work","m":25}]&obs=1   ← transparent background for OBS
```

| Hash param | Description |
|------------|-------------|
| `timers`   | JSON array of `{n: name, m: minutes}` objects |
| `obs`      | Set to `1` to enable transparent OBS overlay mode |
