# User Manual — Countdown Timer
# คู่มือการใช้งาน — นาฬิกานับถอยหลัง

---

> **Language / ภาษา**
> - [🇬🇧 English](#-english)
> - [🇹🇭 ภาษาไทย](#-ภาษาไทย)

---

## 🇬🇧 English

### Table of Contents
1. [Overview](#1-overview)
2. [Getting Started](#2-getting-started)
3. [Adding a Timer](#3-adding-a-timer)
4. [Timer Controls](#4-timer-controls)
5. [Preset Durations](#5-preset-durations)
6. [Timer Sets](#6-timer-sets)
7. [Pomodoro Session Manager](#7-pomodoro-session-manager)
8. [Sequential Mode](#8-sequential-mode)
9. [Session History](#9-session-history)
10. [Themes](#10-themes)
11. [Font Size](#11-font-size)
12. [Clock Display](#12-clock-display)
13. [Fullscreen](#13-fullscreen)
14. [Sound & Notifications](#14-sound--notifications)
15. [Sharing & Embedding](#15-sharing--embedding)
16. [Keyboard Shortcuts](#16-keyboard-shortcuts)
17. [URL Parameters](#17-url-parameters)
18. [Installing as a PWA](#18-installing-as-a-pwa)

---

### 1. Overview

Countdown Timer is a free, full-screen timer that runs entirely in your browser — no account, no installation, and no internet connection required after the first load. You can run multiple timers side-by-side, use Pomodoro cycles, save timer sets, and share timers via a URL.

---

### 2. Getting Started

Open `index.html` in any modern browser, or visit the hosted page. No sign-up or build step is needed.

The app automatically saves its state to your browser's **localStorage**, so your timers will still be there after you refresh the page.

---

### 3. Adding a Timer

1. Click **＋ ADD** to open the timer form.
2. *(Optional)* Type a name in the **Name** field (e.g. "Meeting").
3. Enter the duration in **minutes** (decimals such as `1.5` are allowed).
4. Click **▶ START** to add and start the timer immediately.

**Quick presets** — instead of typing a duration, click one of the preset buttons (5 m, 10 m, 15 m, 25 m 🍅, 45 m) to fill in the minutes automatically, then click **▶ START**.

---

### 4. Timer Controls

Each timer card shows the following buttons:

| Button | Action |
|--------|--------|
| **⏸ PAUSE** | Freeze the timer at its current time |
| **▶ RESUME** | Continue a paused timer |
| **↺ RESET** | Return the timer to its original duration |
| **✕** | Remove the timer card |

**Urgent mode** — when fewer than 60 seconds remain, the display switches to a large red seconds-only countdown so you never miss the alarm.

**Progress bar** — a coloured bar at the bottom of each card fills from left to right as time elapses.

**Hiding controls** — click **HIDE** (or click any timer display) to hide the control panel for a cleaner view. Click anywhere on the page to bring controls back.

---

### 5. Preset Durations

You can save your own custom presets so you don't have to type durations every time.

1. Open the **＋ ADD** form.
2. Enter a name and minutes.
3. Click **💾** (the save icon next to **▶ START**).

Your custom preset will appear alongside the built-in presets (5 m, 10 m, 15 m, 25 m 🍅, 45 m) and can be clicked to fill the form instantly.

To **remove** a custom preset, hover over it and click the **✕** that appears.

---

### 6. Timer Sets

A *Timer Set* is a saved group of timers (names + durations) that you can restore all at once — useful for recurring schedules such as a workshop or class timetable.

| Action | How |
|--------|-----|
| Save a set | Click **⊞ SETS → 💾 Save Current Set**, type a name, then confirm |
| Load a set | Click **⊞ SETS**, then click the name of the set you want |
| Delete a set | Click **⊞ SETS**, then click **✕** next to the set name |

---

### 7. Pomodoro Session Manager

Click **🍅 POMO** to open the Pomodoro panel.

The session follows this cycle:

```
Work → Short Break → Work → Short Break → Work → Short Break → Work → Long Break
```

| Setting | Default | Description |
|---------|---------|-------------|
| Work duration | 25 min | Length of each focus block |
| Short break | 5 min | Break after each work block |
| Long break | 15 min | Break after every 4 work blocks |
| Rounds until long break | 4 | Number of work blocks per cycle |

Click **▶ Start Pomodoro** to begin. The app automatically moves to the next phase when the current timer finishes. The current round number is shown in the panel.

---

### 8. Sequential Mode

Click **↕ SEQ** to enable Sequential Mode.

When active, as soon as one timer finishes, the **next timer** in the list starts automatically. This is ideal for back-to-back agenda items or a series of exercises.

Click **↕ SEQ** again to turn Sequential Mode off.

---

### 9. Session History

Click **📊 STATS** to view the Session History panel.

The panel shows a log of every timer that has completed during the current browser session, along with a **total focus time** for today. This helps you track how much time you have spent on focused work.

---

### 10. Themes

Use the **theme dropdown** in the control panel to change the colour scheme.

| Theme | Description |
|-------|-------------|
| Dark (default) | Dark navy background, green accent |
| Light | Light blue-grey background, blue accent |
| Ocean | Deep ocean blue |
| Sunset | Warm red-orange tones |
| Forest | Dark green tones |
| Purple | Deep purple tones |

Your selected theme is saved automatically.

---

### 11. Font Size

Use the **Aa slider** to scale the timer digits up or down. Larger sizes are useful when presenting on a projector or big screen.

---

### 12. Clock Display

Click **⊙ Clock** to show or hide a live clock alongside your timers. The clock uses your device's local time and is updated every second.

---

### 13. Fullscreen

Click **⛶ FS** to enter fullscreen mode. Press `Esc` or click the button again to exit.

---

### 14. Sound & Notifications

**Alarm sounds** — use the **sound dropdown** to choose:
- Beep (default)
- Bell
- Chime
- Silent

**Volume** — drag the **🔊 slider** to set the alarm volume (0 – 100 %).

**Browser notifications** — the first time a timer finishes, your browser will ask for notification permission. Once granted, you will receive a desktop alert whenever a timer ends, even if the tab is in the background.

---

### 15. Sharing & Embedding

Click **🔗 SHARE** to open the sharing panel.

| Option | Description |
|--------|-------------|
| **Copy URL** | Copies a URL that encodes all current timers. Anyone who opens it will see the same timers. |
| **Copy iframe** | Copies an `<iframe>` snippet for embedding the timer in any web page. |
| **OBS mode** | Adds `&obs=1` to the URL for a transparent-background overlay in OBS Studio. |

**Example shared URL:**
```
index.html#timers=[{"n":"Work","m":25},{"n":"Break","m":5}]
```

---

### 16. Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Pause / Resume the first active timer |
| `N` | Open the Add Timer form |
| `R` | Reset the first timer |
| `F` | Toggle fullscreen |
| `Esc` | Close modal / hide controls |

---

### 17. URL Parameters

#### Legacy single-timer query string

```
index.html?minutes=25&name=Pomodoro
```

| Parameter | Description |
|-----------|-------------|
| `minutes` | Duration in minutes (decimals allowed, e.g. `1.5`) |
| `name` | Optional label for the timer |

#### Hash-based multi-timer

```
index.html#timers=[{"n":"Work","m":25},{"n":"Break","m":5}]
index.html#timers=[{"n":"Work","m":25}]&obs=1
```

| Hash param | Description |
|------------|-------------|
| `timers` | JSON array of `{n: name, m: minutes}` objects |
| `obs` | Set to `1` to enable transparent OBS overlay mode |

---

### 18. Installing as a PWA

The app is a **Progressive Web App (PWA)**. To install it as a standalone app:

1. Open the site in a supported browser (Chrome, Edge, Safari on iOS).
2. Look for the **Install** prompt in the address bar or browser menu.
3. Click **Install** (Chrome / Edge) or **Add to Home Screen** (Safari).

Once installed, the app works fully **offline** — all timer logic runs locally in your browser.

---
---

## 🇹🇭 ภาษาไทย

### สารบัญ
1. [ภาพรวม](#1-ภาพรวม)
2. [การเริ่มต้นใช้งาน](#2-การเริ่มต้นใช้งาน)
3. [การเพิ่มตัวจับเวลา](#3-การเพิ่มตัวจับเวลา)
4. [การควบคุมตัวจับเวลา](#4-การควบคุมตัวจับเวลา)
5. [ค่าเวลาที่ตั้งไว้ล่วงหน้า (Presets)](#5-ค่าเวลาที่ตั้งไว้ล่วงหน้า-presets)
6. [ชุดตัวจับเวลา (Timer Sets)](#6-ชุดตัวจับเวลา-timer-sets)
7. [ระบบโปโมโดโร่](#7-ระบบโปโมโดโร่)
8. [โหมดต่อเนื่อง (Sequential Mode)](#8-โหมดต่อเนื่อง-sequential-mode)
9. [ประวัติเซสชัน (Session History)](#9-ประวัติเซสชัน-session-history)
10. [ธีม (Themes)](#10-ธีม-themes)
11. [ขนาดตัวอักษร](#11-ขนาดตัวอักษร)
12. [การแสดงนาฬิกา](#12-การแสดงนาฬิกา)
13. [โหมดเต็มหน้าจอ](#13-โหมดเต็มหน้าจอ)
14. [เสียงและการแจ้งเตือน](#14-เสียงและการแจ้งเตือน)
15. [การแชร์และการฝัง](#15-การแชร์และการฝัง)
16. [คีย์ลัด (Keyboard Shortcuts)](#16-คีย์ลัด-keyboard-shortcuts)
17. [พารามิเตอร์ URL](#17-พารามิเตอร์-url)
18. [การติดตั้งเป็น PWA](#18-การติดตั้งเป็น-pwa)

---

### 1. ภาพรวม

Countdown Timer คือแอปนาฬิกานับถอยหลังแบบเต็มหน้าจอที่ทำงานได้ทั้งหมดในเบราว์เซอร์ ไม่ต้องสมัครสมาชิก ไม่ต้องติดตั้งโปรแกรม และไม่ต้องใช้อินเทอร์เน็ตหลังจากโหลดครั้งแรก คุณสามารถเปิดตัวจับเวลาหลายตัวพร้อมกัน ใช้วงจรโปโมโดโร่ บันทึกชุดตัวจับเวลา และแชร์ลิงก์ให้ผู้อื่นได้

---

### 2. การเริ่มต้นใช้งาน

เปิดไฟล์ `index.html` ในเบราว์เซอร์สมัยใหม่ หรือเข้าชมผ่านลิงก์ที่โฮสต์ไว้ ไม่จำเป็นต้องสมัครบัญชีหรือ build โปรเจกต์

แอปจะบันทึกสถานะทั้งหมดไว้ใน **localStorage** ของเบราว์เซอร์โดยอัตโนมัติ ดังนั้นตัวจับเวลาของคุณจะยังคงอยู่แม้รีเฟรชหน้าเว็บ

---

### 3. การเพิ่มตัวจับเวลา

1. คลิก **＋ ADD** เพื่อเปิดฟอร์มตัวจับเวลา
2. *(ไม่บังคับ)* พิมพ์ชื่อในช่อง **Name** เช่น "ประชุม"
3. ป้อนระยะเวลาเป็น**นาที** (รองรับทศนิยม เช่น `1.5`)
4. คลิก **▶ START** เพื่อเพิ่มและเริ่มตัวจับเวลาทันที

**ค่าล่วงหน้าด่วน** — แทนที่จะพิมพ์ตัวเลข ให้คลิกปุ่ม Preset (5 น., 10 น., 15 น., 25 น. 🍅, 45 น.) เพื่อกรอกเวลาให้อัตโนมัติ แล้วค่อยคลิก **▶ START**

---

### 4. การควบคุมตัวจับเวลา

การ์ดตัวจับเวลาแต่ละใบมีปุ่มดังนี้:

| ปุ่ม | การทำงาน |
|------|----------|
| **⏸ PAUSE** | หยุดตัวจับเวลาชั่วคราวที่เวลาปัจจุบัน |
| **▶ RESUME** | ดำเนินตัวจับเวลาที่หยุดชั่วคราวต่อ |
| **↺ RESET** | คืนตัวจับเวลากลับไปที่ระยะเวลาเดิม |
| **✕** | ลบการ์ดตัวจับเวลาออก |

**โหมดเร่งด่วน (Urgent Mode)** — เมื่อเหลือเวลาน้อยกว่า 60 วินาที จอแสดงผลจะเปลี่ยนเป็นตัวเลขขนาดใหญ่สีแดงนับวินาที เพื่อให้ไม่พลาดสัญญาณเตือน

**แถบความคืบหน้า** — แถบสีที่ด้านล่างของแต่ละการ์ดจะเต็มจากซ้ายไปขวาตามเวลาที่ผ่านไป

**ซ่อนตัวควบคุม** — คลิก **HIDE** (หรือคลิกที่จอแสดงผลของตัวจับเวลา) เพื่อซ่อนแผงควบคุม คลิกที่ใดก็ได้บนหน้าจอเพื่อแสดงตัวควบคุมกลับมา

---

### 5. ค่าเวลาที่ตั้งไว้ล่วงหน้า (Presets)

คุณสามารถบันทึก Preset ส่วนตัวเพื่อไม่ต้องพิมพ์ระยะเวลาทุกครั้ง

1. เปิดฟอร์ม **＋ ADD**
2. ป้อนชื่อและนาที
3. คลิก **💾** (ไอคอนบันทึกข้างปุ่ม **▶ START**)

Preset ของคุณจะปรากฏพร้อมกับ Preset ในตัว (5 น., 10 น., 15 น., 25 น. 🍅, 45 น.) และคลิกได้ทันที

**ลบ** Preset ส่วนตัว: เลื่อนเมาส์ไปที่ Preset แล้วคลิก **✕** ที่ปรากฏขึ้น

---

### 6. ชุดตัวจับเวลา (Timer Sets)

*Timer Set* คือกลุ่มตัวจับเวลา (ชื่อ + ระยะเวลา) ที่บันทึกไว้ ซึ่งสามารถโหลดขึ้นมาทั้งหมดในครั้งเดียว เหมาะสำหรับตารางเวลาที่ใช้ซ้ำ เช่น ตารางการสอนหรือการประชุม

| การดำเนินการ | วิธีการ |
|-------------|---------|
| บันทึกชุด | คลิก **⊞ SETS → 💾 Save Current Set** พิมพ์ชื่อ แล้วยืนยัน |
| โหลดชุด | คลิก **⊞ SETS** แล้วคลิกชื่อชุดที่ต้องการ |
| ลบชุด | คลิก **⊞ SETS** แล้วคลิก **✕** ข้างชื่อชุด |

---

### 7. ระบบโปโมโดโร่

คลิก **🍅 POMO** เพื่อเปิดแผงโปโมโดโร่

วงจรเซสชันเป็นดังนี้:

```
ทำงาน → พักสั้น → ทำงาน → พักสั้น → ทำงาน → พักสั้น → ทำงาน → พักยาว
```

| การตั้งค่า | ค่าเริ่มต้น | คำอธิบาย |
|------------|------------|----------|
| ระยะเวลาทำงาน | 25 นาที | ความยาวของแต่ละช่วงทำงาน |
| พักสั้น | 5 นาที | พักหลังแต่ละช่วงทำงาน |
| พักยาว | 15 นาที | พักหลังทำงานครบ 4 รอบ |
| รอบจนถึงพักยาว | 4 | จำนวนช่วงทำงานต่อวงจร |

คลิก **▶ Start Pomodoro** เพื่อเริ่ม แอปจะเปลี่ยนไปยังช่วงถัดไปโดยอัตโนมัติเมื่อตัวจับเวลาหมด จำนวนรอบปัจจุบันจะแสดงในแผง

---

### 8. โหมดต่อเนื่อง (Sequential Mode)

คลิก **↕ SEQ** เพื่อเปิดโหมดต่อเนื่อง

เมื่อเปิดใช้งาน เมื่อตัวจับเวลาตัวหนึ่งหมด **ตัวจับเวลาถัดไป** ในรายการจะเริ่มต้นโดยอัตโนมัติ เหมาะสำหรับรายการต่อเนื่อง เช่น วาระประชุมหรือชุดการออกกำลังกาย

คลิก **↕ SEQ** อีกครั้งเพื่อปิด

---

### 9. ประวัติเซสชัน (Session History)

คลิก **📊 STATS** เพื่อดูแผงประวัติเซสชัน

แผงจะแสดงบันทึกของตัวจับเวลาทุกตัวที่เสร็จสิ้นในเซสชันเบราว์เซอร์ปัจจุบัน พร้อมกับ **เวลาโฟกัสรวมวันนี้** เพื่อช่วยติดตามเวลาที่ใช้ในการทำงาน

---

### 10. ธีม (Themes)

ใช้ **เมนูเลือกธีม** ในแผงควบคุมเพื่อเปลี่ยนสีของแอป

| ธีม | คำอธิบาย |
|-----|----------|
| Dark (ค่าเริ่มต้น) | พื้นหลังน้ำเงินเข้ม สีสำคัญเขียว |
| Light | พื้นหลังฟ้าอ่อน-เทา สีสำคัญน้ำเงิน |
| Ocean | น้ำเงินมหาสมุทรเข้ม |
| Sunset | โทนแดง-ส้มอุ่น |
| Forest | โทนเขียวเข้ม |
| Purple | โทนม่วงเข้ม |

ธีมที่เลือกจะถูกบันทึกอัตโนมัติ

---

### 11. ขนาดตัวอักษร

ใช้ **ตัวเลื่อน Aa** เพื่อปรับขนาดตัวเลขของตัวจับเวลาให้ใหญ่หรือเล็กลง ขนาดใหญ่จะเป็นประโยชน์เมื่อนำเสนอบนโปรเจกเตอร์หรือจอขนาดใหญ่

---

### 12. การแสดงนาฬิกา

คลิก **⊙ Clock** เพื่อแสดงหรือซ่อนนาฬิกาสดข้างตัวจับเวลา นาฬิกาใช้เวลาท้องถิ่นของอุปกรณ์และอัปเดตทุกวินาที

---

### 13. โหมดเต็มหน้าจอ

คลิก **⛶ FS** เพื่อเข้าสู่โหมดเต็มหน้าจอ กด `Esc` หรือคลิกปุ่มอีกครั้งเพื่อออก

---

### 14. เสียงและการแจ้งเตือน

**เสียงสัญญาณเตือน** — ใช้ **เมนูเลือกเสียง** เพื่อเลือก:
- Beep (ค่าเริ่มต้น)
- Bell (ระฆัง)
- Chime (เพลงกริ่ง)
- Silent (ไม่มีเสียง)

**ระดับเสียง** — ลาก **ตัวเลื่อน 🔊** เพื่อตั้งค่าระดับเสียงสัญญาณเตือน (0–100 %)

**การแจ้งเตือนเบราว์เซอร์** — ครั้งแรกที่ตัวจับเวลาหมด เบราว์เซอร์จะขอสิทธิ์การแจ้งเตือน เมื่ออนุญาตแล้ว คุณจะได้รับการแจ้งเตือนบนเดสก์ท็อปทุกครั้งที่ตัวจับเวลาหมด แม้แท็บอยู่ในพื้นหลัง

---

### 15. การแชร์และการฝัง

คลิก **🔗 SHARE** เพื่อเปิดแผงการแชร์

| ตัวเลือก | คำอธิบาย |
|---------|----------|
| **Copy URL** | คัดลอก URL ที่เข้ารหัสตัวจับเวลาทั้งหมดในปัจจุบัน ผู้ที่เปิดลิงก์นี้จะเห็นตัวจับเวลาเดียวกัน |
| **Copy iframe** | คัดลอก snippet `<iframe>` สำหรับฝังตัวจับเวลาในเว็บเพจใด ๆ |
| **OBS mode** | เพิ่ม `&obs=1` ต่อท้าย URL สำหรับ overlay พื้นหลังโปร่งใสใน OBS Studio |

**ตัวอย่าง URL ที่แชร์:**
```
index.html#timers=[{"n":"Work","m":25},{"n":"Break","m":5}]
```

---

### 16. คีย์ลัด (Keyboard Shortcuts)

| ปุ่ม | การทำงาน |
|------|----------|
| `Space` | หยุด / ดำเนินตัวจับเวลาแรกที่ทำงานอยู่ |
| `N` | เปิดฟอร์มเพิ่มตัวจับเวลา |
| `R` | รีเซ็ตตัวจับเวลาแรก |
| `F` | เปิด/ปิดโหมดเต็มหน้าจอ |
| `Esc` | ปิดหน้าต่างโมดัล / ซ่อนตัวควบคุม |

---

### 17. พารามิเตอร์ URL

#### Query string แบบดั้งเดิม (ตัวจับเวลาเดียว)

```
index.html?minutes=25&name=Pomodoro
```

| พารามิเตอร์ | คำอธิบาย |
|------------|----------|
| `minutes` | ระยะเวลาเป็นนาที (รองรับทศนิยม เช่น `1.5`) |
| `name` | ชื่อของตัวจับเวลา (ไม่บังคับ) |

#### Hash-based แบบหลายตัวจับเวลา

```
index.html#timers=[{"n":"Work","m":25},{"n":"Break","m":5}]
index.html#timers=[{"n":"Work","m":25}]&obs=1
```

| พารามิเตอร์ Hash | คำอธิบาย |
|----------------|----------|
| `timers` | อาร์เรย์ JSON ของออบเจกต์ `{n: ชื่อ, m: นาที}` |
| `obs` | ตั้งค่าเป็น `1` เพื่อเปิดโหมด overlay โปร่งใสสำหรับ OBS |

---

### 18. การติดตั้งเป็น PWA

แอปนี้เป็น **Progressive Web App (PWA)** สามารถติดตั้งเป็นแอปแบบ standalone ได้ดังนี้:

1. เปิดเว็บไซต์ในเบราว์เซอร์ที่รองรับ (Chrome, Edge, Safari บน iOS)
2. มองหาปุ่ม **Install** ในแถบที่อยู่หรือเมนูเบราว์เซอร์
3. คลิก **Install** (Chrome / Edge) หรือ **Add to Home Screen** (Safari)

เมื่อติดตั้งแล้ว แอปจะทำงานได้**ออฟไลน์อย่างสมบูรณ์** — ตรรกะตัวจับเวลาทั้งหมดทำงานในเครื่องของคุณ

---

*Last updated: 2026-05-04*
