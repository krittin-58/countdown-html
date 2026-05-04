# countdown-html

A full-screen countdown timer that runs entirely in the browser — no build step, no dependencies.

## Features

### Timers
- **Multiple timers** — run several countdowns side-by-side in a responsive grid
- **Pause / Resume** — freeze any individual timer and continue exactly where it left off
- **Preset durations** — built-in 5 m, 10 m, 15 m, 25 m 🍅, 45 m; plus **save your own custom presets**
- **Timer names** — label each timer (e.g. "Meeting", "Lunch break")
- **Timer Sets** — save and restore groups of timers (e.g. a full workshop schedule)
- **+1m / +5m** — add time to any running or paused timer on the fly
- **Duplicate** — clone a timer card with one click (⧉)
- **Reorder** — move timer cards up or down (↑/↓)
- **🔁 Loop mode** — timer restarts automatically when it finishes
- **⏱ Stopwatch mode** — switch any timer to count up from zero
- **Progress bar** — visual fill showing time remaining vs. total
- **Urgent mode** — when < 60 s remain, the display switches to seconds-only in large red text
- **Finish animation** — flash effect when a timer completes
- **Persistent state** — timers survive a page refresh via `localStorage`

### Productivity
- **🍅 Pomodoro Session Manager** — auto-cycles Work → Short Break → Work → Long Break with round counter
- **⚙️ Custom Pomodoro durations** — set Work, Short Break, Long Break times and interval before starting
- **↕ Sequential Mode** — automatically starts the next timer when the current one finishes
- **📊 Session History** — logs every completed timer; shows today's total focus time
- **🎯 Daily focus goal** — set a target in minutes; track progress with a bar in Stats
- **📅 7-day focus chart** — bar chart of your focus time for the last 7 days
- **⬇️ Export history** — download session history as a CSV file

### Notifications & Audio
- **Browser Notifications** — get a desktop alert when a timer finishes, even in a background tab
- **Alarm sounds** — choose from Beep (default), Bell, Chime, or Silent
- **Volume control** — adjust the alarm volume with a slider
- **Sound preview** — hear a short sample when you change the alarm sound

### Visual
- **Themes** — Auto (follows OS dark/light), Dark, Light, Ocean, Sunset, Forest, Purple
- **⊙ Clock** — toggle a live clock alongside your timers
- **Font size slider** — scale up timer digits for projectors or large displays
- **Fullscreen** — one click to enter / exit
- **Urgent card glow** — pulsing red glow on a timer card when < 60 s remain

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
| `A` | Pause **all** running timers |
| `S` | Resume **all** paused timers |
| `F` | Toggle fullscreen |
| `Esc` | Close modal / hide controls |

### Accessibility
- ARIA labels and roles on all interactive elements
- `aria-live` regions for timer displays and clock
- Progress bars with `role="progressbar"` and `aria-valuenow`

### Smart TV
- **File-based localStorage shim** — on Samsung Smart TVs where `localStorage` is unavailable, a file-backed shim is installed automatically (`smart-tv.js`) with full `setItem`, `getItem`, `removeItem`, and `clear` support
- **In-page dialogs** — `confirm()`, `prompt()`, and `alert()` are replaced with custom modal dialogs compatible with platforms that block native dialogs (e.g. Samsung Tizen)
- **Vendor-prefixed Fullscreen API** — `webkitRequestFullscreen`, `mozRequestFullScreen`, and `msRequestFullscreen` prefixes ensure full-screen works on all Smart TV browsers
- **Remote control / D-pad navigation** — arrow keys move focus between buttons; the Samsung hardware Back key (`VK_BACK`, keyCode `10009`) behaves like Escape
- **Visible focus indicator** — high-contrast focus outline on all interactive elements for TV remote navigation
- **ES5/ES6 polyfills** — `Element.closest`, `String.padStart`, `Array.find`, `Array.findIndex` are polyfilled for older TV browser engines
- **CSS compatibility** — `inset` shorthand replaced with explicit `top/right/bottom/left` for older WebKit-based TV browsers
- **Changelog popup** — shows what's new on first load after an update (dismissed per version, stored in `localStorage`)

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

## Changelog

### v1.2.0 — More Features
- **⏱ Stopwatch mode** — toggle any timer to count up from zero
- **🔁 Loop mode** — timer restarts automatically when it finishes
- **+1m / +5m buttons** — add time to a running or paused timer on the fly
- **⧉ Duplicate** — clone any timer card
- **↑↓ Reorder** — move timer cards up and down
- **⚙️ Custom Pomodoro durations** — set Work, Short Break, Long Break & interval
- **🌗 Auto theme** — follows your OS dark/light mode preference
- **🔔 Sound preview** — plays a sample when you change the alarm sound
- **🏷️ Tab title countdown** — browser tab shows time remaining while a timer runs
- **💡 Wake Lock** — prevents screen sleep while a timer is running
- **📅 7-day focus chart** in the Stats panel
- **🎯 Daily focus goal** with progress bar in Stats
- **⬇️ Export history to CSV**
- **⌨️ New shortcuts** — `A` = pause all, `S` = resume all
- **✨ Finish animation** & urgent card glow

### v1.1.0 — Smart TV Support
- Full Smart TV / Samsung Tizen compatibility (localStorage shim, in-page dialogs, D-pad navigation, Back button, Fullscreen vendor prefixes, ES5/ES6 polyfills, CSS compatibility)
- Added **📋 WHAT'S NEW** button in the control panel
- Changelog popup shown automatically on first load after an update
- Fixed missing `notif-allow-btn` element ID that caused silent JS errors
- Replaced `URLSearchParams` with a manual parser for older TV browsers

### v1.0.0 — Initial release
- Multiple simultaneous countdown timers
- Pomodoro session manager (Work → Short Break → Long Break cycle)
- Sequential mode, Timer Sets, Session History
- 6 themes, alarm sounds, font-size slider, OBS overlay mode
- Share URL, iframe embed, PWA / offline support
