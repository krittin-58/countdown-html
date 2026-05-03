'use strict';

/**
 * Tests for all JavaScript functions embedded in index.html.
 *
 * Strategy: load the full HTML into a JSDOM instance with runScripts:'dangerously'
 * so every function is available on the window object.  Each test (or describe
 * block) receives a fresh window to prevent state from bleeding between tests.
 *
 * The smart-tv.js external script is stripped before parsing because:
 *  - it targets Samsung Smart TV APIs that do not exist in JSDOM, and
 *  - it would only activate when localStorage is undefined, which never happens
 *    in a JSDOM context that has a URL.
 */

const { JSDOM } = require('jsdom');
const fs   = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');

// A fixed "current time" used throughout – lets time-dependent assertions be
// deterministic without relying on jest fake-timers leaking into jsdom.
const FIXED_NOW = 1_700_000_000_000;

/**
 * Create a fresh JSDOM window running the countdown app.
 *
 * @param {string} searchStr  Optional URL search string, e.g. '?minutes=5'
 * @returns {Window}          The jsdom Window object
 */
function loadApp(searchStr = '') {
    const html = fs.readFileSync(HTML_PATH, 'utf-8');
    // Note: the external smart-tv.js <script> tag in the HTML is silently ignored
    // by jsdom when the `resources` option is not set to 'usable'.

    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: `http://localhost/${searchStr}`,
        beforeParse(win) {
            // Pin Date.now() so every endTime calculation is deterministic.
            win.Date.now = () => FIXED_NOW;

            // Provide a no-op AudioContext so playBeep() does not throw.
            win.AudioContext = class MockAudioContext {
                get currentTime() { return 0; }
                createOscillator() {
                    return {
                        connect() {},
                        type: 'sine',
                        frequency: { setValueAtTime() {} },
                        start() {},
                        stop() {},
                    };
                }
                createGain() {
                    return {
                        connect() {},
                        gain: {
                            setValueAtTime() {},
                            exponentialRampToValueAtTime() {},
                        },
                    };
                }
            };
        },
    });

    return dom.window;
}

// ─────────────────────────────────────────────────────────────────────────────
// makeTimer
// ─────────────────────────────────────────────────────────────────────────────
describe('makeTimer', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('stores the supplied name', () => {
        expect(win.makeTimer('Focus', 1).name).toBe('Focus');
    });

    test('converts undefined name to empty string', () => {
        expect(win.makeTimer(undefined, 1).name).toBe('');
    });

    test('converts null name to empty string', () => {
        expect(win.makeTimer(null, 1).name).toBe('');
    });

    test('calculates totalMs for whole minutes', () => {
        expect(win.makeTimer('', 2).totalMs).toBe(120_000);
    });

    test('calculates totalMs for fractional minutes', () => {
        expect(win.makeTimer('', 0.5).totalMs).toBe(30_000);
    });

    test('sets remainingMs equal to totalMs', () => {
        const t = win.makeTimer('', 5);
        expect(t.remainingMs).toBe(t.totalMs);
    });

    test('sets endTime to now + totalMs', () => {
        const t = win.makeTimer('', 1);
        expect(t.endTime).toBe(FIXED_NOW + 60_000);
    });

    test('starts not paused', () => {
        expect(win.makeTimer('', 1).isPaused).toBe(false);
    });

    test('starts not finished', () => {
        expect(win.makeTimer('', 1).hasFinished).toBe(false);
    });

    test('starts without played-sound flag', () => {
        expect(win.makeTimer('', 1).hasPlayedSound).toBe(false);
    });

    test('increments id with each call', () => {
        const a = win.makeTimer('', 1);
        const b = win.makeTimer('', 1);
        expect(b.id).toBe(a.id + 1);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getRemaining
// ─────────────────────────────────────────────────────────────────────────────
describe('getRemaining', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('returns remainingMs when the timer is paused', () => {
        const t = win.makeTimer('', 1);
        t.isPaused = true;
        t.remainingMs = 42_000;
        expect(win.getRemaining(t)).toBe(42_000);
    });

    test('returns endTime − now when the timer is running', () => {
        const t = win.makeTimer('', 1);
        t.isPaused = false;
        t.endTime = FIXED_NOW + 30_000;
        expect(win.getRemaining(t)).toBe(30_000);
    });

    test('can return a negative value for an overdue running timer', () => {
        const t = win.makeTimer('', 1);
        t.isPaused = false;
        t.endTime = FIXED_NOW - 5_000;
        expect(win.getRemaining(t)).toBe(-5_000);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// findTimer
// ─────────────────────────────────────────────────────────────────────────────
describe('findTimer', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('finds a timer by its id', () => {
        const t = win.makeTimer('Alpha', 1);
        win.timers.push(t);
        expect(win.findTimer(t.id)).toBe(t);
    });

    test('returns undefined for a non-existent id', () => {
        expect(win.findTimer(99_999)).toBeUndefined();
    });

    test('returns the correct timer when multiple exist', () => {
        const [a, b, c] = [win.makeTimer('A', 1), win.makeTimer('B', 2), win.makeTimer('C', 3)];
        win.timers.push(a, b, c);
        expect(win.findTimer(b.id)).toBe(b);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// maxTimerId
// ─────────────────────────────────────────────────────────────────────────────
describe('maxTimerId', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('returns 0 when there are no timers', () => {
        win.timers.length = 0;
        expect(win.maxTimerId()).toBe(0);
    });

    test('returns the highest id', () => {
        const [a, b, c] = [win.makeTimer('', 1), win.makeTimer('', 1), win.makeTimer('', 1)];
        win.timers.push(a, b, c);
        expect(win.maxTimerId()).toBe(c.id);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// pauseTimer
// ─────────────────────────────────────────────────────────────────────────────
describe('pauseTimer', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('sets isPaused to true', () => {
        const t = win.makeTimer('', 1);
        win.timers.push(t);
        win.pauseTimer(t.id);
        expect(t.isPaused).toBe(true);
    });

    test('captures remaining time into remainingMs', () => {
        const t = win.makeTimer('', 1);
        t.endTime = FIXED_NOW + 30_000;
        win.timers.push(t);
        win.pauseTimer(t.id);
        expect(t.remainingMs).toBe(30_000);
    });

    test('clamps remainingMs to 0 for an overdue timer', () => {
        const t = win.makeTimer('', 1);
        t.endTime = FIXED_NOW - 5_000;
        win.timers.push(t);
        win.pauseTimer(t.id);
        expect(t.remainingMs).toBe(0);
    });

    test('does nothing if the timer is already paused', () => {
        const t = win.makeTimer('', 1);
        t.isPaused = true;
        t.remainingMs = 20_000;
        win.timers.push(t);
        win.pauseTimer(t.id);
        expect(t.remainingMs).toBe(20_000);
    });

    test('does nothing if the timer has already finished', () => {
        const t = win.makeTimer('', 1);
        t.hasFinished = true;
        win.timers.push(t);
        win.pauseTimer(t.id);
        expect(t.isPaused).toBe(false);
    });

    test('does not throw for a non-existent id', () => {
        expect(() => win.pauseTimer(99_999)).not.toThrow();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// resumeTimer
// ─────────────────────────────────────────────────────────────────────────────
describe('resumeTimer', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('sets isPaused to false', () => {
        const t = win.makeTimer('', 1);
        t.isPaused = true;
        t.remainingMs = 30_000;
        win.timers.push(t);
        win.resumeTimer(t.id);
        expect(t.isPaused).toBe(false);
    });

    test('updates endTime to now + remainingMs', () => {
        const t = win.makeTimer('', 1);
        t.isPaused = true;
        t.remainingMs = 30_000;
        win.timers.push(t);
        win.resumeTimer(t.id);
        expect(t.endTime).toBe(FIXED_NOW + 30_000);
    });

    test('does nothing if the timer is not paused', () => {
        const t = win.makeTimer('', 1);
        const originalEnd = t.endTime;
        win.timers.push(t);
        win.resumeTimer(t.id);
        expect(t.endTime).toBe(originalEnd);
    });

    test('does not throw for a non-existent id', () => {
        expect(() => win.resumeTimer(99_999)).not.toThrow();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// togglePause
// ─────────────────────────────────────────────────────────────────────────────
describe('togglePause', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('pauses a running timer', () => {
        const t = win.makeTimer('', 1);
        win.timers.push(t);
        win.togglePause(t.id);
        expect(t.isPaused).toBe(true);
    });

    test('resumes a paused timer', () => {
        const t = win.makeTimer('', 1);
        t.isPaused = true;
        win.timers.push(t);
        win.togglePause(t.id);
        expect(t.isPaused).toBe(false);
    });

    test('does not throw for a non-existent id', () => {
        expect(() => win.togglePause(99_999)).not.toThrow();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// resetTimer
// ─────────────────────────────────────────────────────────────────────────────
describe('resetTimer', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('restores remainingMs to totalMs', () => {
        const t = win.makeTimer('', 1);
        t.remainingMs = 5_000;
        win.timers.push(t);
        win.resetTimer(t.id);
        expect(t.remainingMs).toBe(t.totalMs);
    });

    test('sets endTime to now + totalMs', () => {
        const t = win.makeTimer('', 1);
        win.timers.push(t);
        win.resetTimer(t.id);
        expect(t.endTime).toBe(FIXED_NOW + t.totalMs);
    });

    test('unpauses the timer', () => {
        const t = win.makeTimer('', 1);
        t.isPaused = true;
        win.timers.push(t);
        win.resetTimer(t.id);
        expect(t.isPaused).toBe(false);
    });

    test('clears the hasFinished flag', () => {
        const t = win.makeTimer('', 1);
        t.hasFinished = true;
        win.timers.push(t);
        win.resetTimer(t.id);
        expect(t.hasFinished).toBe(false);
    });

    test('clears the hasPlayedSound flag', () => {
        const t = win.makeTimer('', 1);
        t.hasPlayedSound = true;
        win.timers.push(t);
        win.resetTimer(t.id);
        expect(t.hasPlayedSound).toBe(false);
    });

    test('does not throw for a non-existent id', () => {
        expect(() => win.resetTimer(99_999)).not.toThrow();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// removeTimer
// ─────────────────────────────────────────────────────────────────────────────
describe('removeTimer', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('removes the specified timer from the array', () => {
        const t = win.makeTimer('', 1);
        win.timers.push(t);
        win.removeTimer(t.id);
        expect(win.timers.find(x => x.id === t.id)).toBeUndefined();
    });

    test('leaves other timers intact', () => {
        const [a, b] = [win.makeTimer('A', 1), win.makeTimer('B', 2)];
        win.timers.push(a, b);
        win.removeTimer(a.id);
        expect(win.timers.length).toBe(1);
        expect(win.timers[0].id).toBe(b.id);
    });

    test('does not throw for a non-existent id', () => {
        expect(() => win.removeTimer(99_999)).not.toThrow();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// escHtml
// ─────────────────────────────────────────────────────────────────────────────
describe('escHtml', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('escapes ampersands', () => {
        expect(win.escHtml('a&b')).toBe('a&amp;b');
    });

    test('escapes less-than', () => {
        expect(win.escHtml('<tag>')).toBe('&lt;tag&gt;');
    });

    test('escapes greater-than', () => {
        expect(win.escHtml('a>b')).toBe('a&gt;b');
    });

    test('escapes multiple special characters in one string', () => {
        expect(win.escHtml('<a href="x&y">')).toBe('&lt;a href="x&amp;y"&gt;');
    });

    test('returns plain strings unchanged', () => {
        expect(win.escHtml('hello world')).toBe('hello world');
    });

    test('converts numbers to their string representation', () => {
        expect(win.escHtml(42)).toBe('42');
    });

    test('converts null to the string "null"', () => {
        expect(win.escHtml(null)).toBe('null');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// setPreset
// ─────────────────────────────────────────────────────────────────────────────
describe('setPreset', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('writes an integer value to the minutes input', () => {
        win.setPreset(25);
        expect(win.document.getElementById('new-minutes').value).toBe('25');
    });

    test('writes a decimal value to the minutes input', () => {
        win.setPreset(0.5);
        expect(win.document.getElementById('new-minutes').value).toBe('0.5');
    });

    test('each preset constant matches the button label (5, 10, 15, 25, 45)', () => {
        [5, 10, 15, 25, 45].forEach(m => {
            win.setPreset(m);
            expect(win.document.getElementById('new-minutes').value).toBe(String(m));
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// toggleAddForm
// ─────────────────────────────────────────────────────────────────────────────
describe('toggleAddForm', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('adds the "visible" class when not already visible', () => {
        const form = win.document.getElementById('add-form');
        form.classList.remove('visible');
        win.toggleAddForm();
        expect(form.classList.contains('visible')).toBe(true);
    });

    test('removes the "visible" class when already visible', () => {
        const form = win.document.getElementById('add-form');
        form.classList.add('visible');
        win.toggleAddForm();
        expect(form.classList.contains('visible')).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// addTimerFromForm
// ─────────────────────────────────────────────────────────────────────────────
describe('addTimerFromForm', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    function fill(name, minutes) {
        win.document.getElementById('new-name').value    = name;
        win.document.getElementById('new-minutes').value = String(minutes);
    }

    test('adds a timer with the name and minutes entered in the form', () => {
        fill('Focus', 25);
        win.addTimerFromForm();
        const added = win.timers[win.timers.length - 1];
        expect(added.name).toBe('Focus');
        expect(added.totalMs).toBe(25 * 60_000);
    });

    test('trims whitespace from the name', () => {
        fill('  My Timer  ', 5);
        win.addTimerFromForm();
        expect(win.timers[win.timers.length - 1].name).toBe('My Timer');
    });

    test('does not add a timer when minutes is 0', () => {
        fill('', 0);
        const before = win.timers.length;
        win.addTimerFromForm();
        expect(win.timers.length).toBe(before);
    });

    test('does not add a timer when minutes is negative', () => {
        fill('', -5);
        const before = win.timers.length;
        win.addTimerFromForm();
        expect(win.timers.length).toBe(before);
    });

    test('does not add a timer when minutes field is empty', () => {
        fill('', '');
        const before = win.timers.length;
        win.addTimerFromForm();
        expect(win.timers.length).toBe(before);
    });

    test('clears the name field after adding', () => {
        fill('Test', 5);
        win.addTimerFromForm();
        expect(win.document.getElementById('new-name').value).toBe('');
    });

    test('hides the add form after a successful add', () => {
        win.document.getElementById('add-form').classList.add('visible');
        fill('', 5);
        win.addTimerFromForm();
        expect(win.document.getElementById('add-form').classList.contains('visible')).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildCard
// ─────────────────────────────────────────────────────────────────────────────
describe('buildCard', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('sets data-id to the timer id', () => {
        const t = win.makeTimer('T', 1);
        expect(win.buildCard(t).dataset.id).toBe(String(t.id));
    });

    test('renders the timer name in the label', () => {
        const t = win.makeTimer('MyTimer', 1);
        expect(win.buildCard(t).querySelector('.timer-label').textContent).toBe('MyTimer');
    });

    test('HTML-escapes a malicious name', () => {
        const t = win.makeTimer('<script>alert(1)</script>', 1);
        const card = win.buildCard(t);
        // Raw <script> tag must not appear in markup
        expect(card.innerHTML).not.toContain('<script>');
        // But the text content should be the literal string
        expect(card.querySelector('.timer-label').textContent).toBe('<script>alert(1)</script>');
    });

    test('contains a .timer-display element', () => {
        const t = win.makeTimer('', 1);
        expect(win.buildCard(t).querySelector('.timer-display')).not.toBeNull();
    });

    test('contains a .progress-fill element', () => {
        const t = win.makeTimer('', 1);
        expect(win.buildCard(t).querySelector('.progress-fill')).not.toBeNull();
    });

    test('contains a pause button (.btn-pr)', () => {
        const t = win.makeTimer('', 1);
        expect(win.buildCard(t).querySelector('.btn-pr')).not.toBeNull();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// renderCards
// ─────────────────────────────────────────────────────────────────────────────
describe('renderCards', () => {
    let win;
    beforeEach(() => {
        win = loadApp();
        win.timers.length = 0; // start clean
    });

    test('creates a card for each timer', () => {
        const t = win.makeTimer('Solo', 5);
        win.timers.push(t);
        win.renderCards();
        expect(win.document.querySelector(`[data-id="${t.id}"]`)).not.toBeNull();
    });

    test('removes the card for a deleted timer', () => {
        const t = win.makeTimer('Gone', 5);
        win.timers.push(t);
        win.renderCards();
        win.timers = win.timers.filter(x => x.id !== t.id);
        win.renderCards();
        expect(win.document.querySelector(`[data-id="${t.id}"]`)).toBeNull();
    });

    test('does not duplicate a card that already exists', () => {
        const t = win.makeTimer('Dup', 5);
        win.timers.push(t);
        win.renderCards();
        win.renderCards();
        expect(win.document.querySelectorAll(`[data-id="${t.id}"]`).length).toBe(1);
    });

    test('adds the "solo" class when exactly one timer is present', () => {
        win.timers.push(win.makeTimer('A', 1));
        win.renderCards();
        expect(win.document.getElementById('timers').classList.contains('solo')).toBe(true);
    });

    test('removes the "solo" class when more than one timer is present', () => {
        win.timers.push(win.makeTimer('A', 1), win.makeTimer('B', 1));
        win.renderCards();
        expect(win.document.getElementById('timers').classList.contains('solo')).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// updateCards
// ─────────────────────────────────────────────────────────────────────────────
describe('updateCards', () => {
    let win;

    beforeEach(() => {
        win = loadApp();
        win.timers.length = 0;
    });

    /** Add a timer to win.timers and render its card. Returns the timer. */
    function addTimer(name, minutes, overrides = {}) {
        const t = Object.assign(win.makeTimer(name, minutes), overrides);
        win.timers.push(t);
        win.renderCards();
        return t;
    }

    function display(id) {
        return win.document.querySelector(`[data-id="${id}"] .timer-display`);
    }
    function fill(id) {
        return win.document.querySelector(`[data-id="${id}"] .progress-fill`);
    }
    function pauseBtn(id) {
        return win.document.querySelector(`[data-id="${id}"] .btn-pr`);
    }

    test('shows "00:00" for a finished (expired) timer', () => {
        const t = addTimer('', 1);
        t.endTime = FIXED_NOW - 1_000;
        win.updateCards();
        expect(display(t.id).textContent).toBe('00:00');
    });

    test('applies the "finished" CSS class for an expired timer', () => {
        const t = addTimer('', 1);
        t.endTime = FIXED_NOW - 1_000;
        win.updateCards();
        expect(display(t.id).className).toContain('finished');
    });

    test('disables the pause button for a finished timer', () => {
        const t = addTimer('', 1);
        t.endTime = FIXED_NOW - 1_000;
        win.updateCards();
        expect(pauseBtn(t.id).disabled).toBe(true);
    });

    test('sets the hasFinished flag when the timer first reaches zero', () => {
        const t = addTimer('', 1);
        t.endTime = FIXED_NOW - 1_000;
        win.updateCards();
        expect(t.hasFinished).toBe(true);
    });

    test('shows seconds only (no colon) when < 60 s remain', () => {
        const t = addTimer('', 1);
        t.endTime = FIXED_NOW + 30_000; // 30 seconds
        win.updateCards();
        expect(display(t.id).textContent).toBe('30');
    });

    test('applies the "urgent" CSS class when < 60 s remain', () => {
        const t = addTimer('', 1);
        t.endTime = FIXED_NOW + 30_000;
        win.updateCards();
        expect(display(t.id).className).toContain('urgent');
    });

    test('shows MM:SS for a normal (≥ 60 s) timer', () => {
        const t = addTimer('', 5);
        t.totalMs  = 5 * 60_000;
        t.endTime  = FIXED_NOW + 5 * 60_000 + 30_000; // 5 m 30 s
        win.updateCards();
        expect(display(t.id).textContent).toBe('5:30');
    });

    test('pads single-digit seconds with a leading zero', () => {
        const t = addTimer('', 5);
        t.totalMs  = 5 * 60_000;
        t.endTime  = FIXED_NOW + 5 * 60_000 + 5_000; // 5 m 05 s
        win.updateCards();
        expect(display(t.id).textContent).toBe('5:05');
    });

    test('shows "RESUME" on the pause button when the timer is paused', () => {
        const t = addTimer('', 1);
        t.isPaused    = true;
        t.remainingMs = 30_000;
        win.updateCards();
        expect(pauseBtn(t.id).textContent).toContain('RESUME');
    });

    test('shows "PAUSE" on the pause button when the timer is running', () => {
        const t = addTimer('', 1);
        t.endTime = FIXED_NOW + 30_000;
        win.updateCards();
        expect(pauseBtn(t.id).textContent).toContain('PAUSE');
    });

    test('sets progress fill to 0% for a finished timer', () => {
        const t = addTimer('', 1);
        t.endTime = FIXED_NOW - 1_000;
        win.updateCards();
        expect(fill(t.id).style.width).toBe('0%');
    });

    test('reflects the correct percentage of time remaining', () => {
        const t = addTimer('', 2);
        t.totalMs = 120_000;
        t.endTime = FIXED_NOW + 60_000; // 50 %
        win.updateCards();
        expect(fill(t.id).style.width).toBe('50%');
    });

    test('applies "urgent" class on progress fill when < 60 s remain', () => {
        const t = addTimer('', 1);
        t.endTime = FIXED_NOW + 30_000;
        win.updateCards();
        expect(fill(t.id).className).toContain('urgent');
    });

    test('does not add "urgent" class on progress fill with ≥ 60 s remaining', () => {
        const t = addTimer('', 5);
        t.totalMs = 5 * 60_000;
        t.endTime = FIXED_NOW + 3 * 60_000; // 3 min left
        win.updateCards();
        expect(fill(t.id).className).not.toContain('urgent');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// toggleControls
// ─────────────────────────────────────────────────────────────────────────────
describe('toggleControls', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('adds "controls-hidden" class to body', () => {
        win.document.body.classList.remove('controls-hidden');
        win.toggleControls();
        expect(win.document.body.classList.contains('controls-hidden')).toBe(true);
    });

    test('removes "controls-hidden" class from body', () => {
        win.document.body.classList.add('controls-hidden');
        win.toggleControls();
        expect(win.document.body.classList.contains('controls-hidden')).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// onTimersClick
// ─────────────────────────────────────────────────────────────────────────────
describe('onTimersClick', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    /** Construct a synthetic event object matching what onTimersClick expects. */
    function evt({ isButton = false, isDisplay = false } = {}) {
        return {
            target: {
                closest: () => (isButton ? {} : null),
                classList: { contains: cls => isDisplay && cls === 'timer-display' },
            },
        };
    }

    test('does nothing (no class change) when a button is clicked', () => {
        win.document.body.classList.remove('controls-hidden');
        win.onTimersClick(evt({ isButton: true }));
        expect(win.document.body.classList.contains('controls-hidden')).toBe(false);
    });

    test('shows controls when they are hidden and a non-display area is clicked', () => {
        win.document.body.classList.add('controls-hidden');
        win.onTimersClick(evt());
        expect(win.document.body.classList.contains('controls-hidden')).toBe(false);
    });

    test('hides controls when timer-display is clicked while controls are visible', () => {
        win.document.body.classList.remove('controls-hidden');
        win.onTimersClick(evt({ isDisplay: true }));
        expect(win.document.body.classList.contains('controls-hidden')).toBe(true);
    });

    test('does NOT hide controls when a non-display area is clicked while controls are visible', () => {
        win.document.body.classList.remove('controls-hidden');
        win.onTimersClick(evt());
        expect(win.document.body.classList.contains('controls-hidden')).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// setTheme
// ─────────────────────────────────────────────────────────────────────────────
describe('setTheme', () => {
    let win;
    beforeEach(() => { win = loadApp(); });

    test('sets data-theme attribute on <html>', () => {
        win.setTheme('ocean');
        expect(win.document.documentElement.dataset.theme).toBe('ocean');
    });

    test('persists the theme in localStorage', () => {
        win.setTheme('sunset');
        expect(win.localStorage.theme).toBe('sunset');
    });

    test('clears the theme when an empty string is passed', () => {
        win.setTheme('forest');
        win.setTheme('');
        expect(win.document.documentElement.dataset.theme).toBe('');
    });

    test('all five theme values are accepted without error', () => {
        ['', 'ocean', 'sunset', 'forest', 'purple'].forEach(theme => {
            expect(() => win.setTheme(theme)).not.toThrow();
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// saveState / loadState
// ─────────────────────────────────────────────────────────────────────────────
describe('saveState and loadState', () => {
    let win;
    beforeEach(() => {
        win = loadApp();
        win.timers.length = 0;
    });

    test('saveState writes timers to localStorage.timersState', () => {
        win.timers.push(win.makeTimer('Persist', 5));
        win.saveState();
        const saved = JSON.parse(win.localStorage.timersState);
        expect(saved.length).toBe(1);
        expect(saved[0].name).toBe('Persist');
    });

    test('saveState persists nextId', () => {
        win.nextId = 42;
        win.saveState();
        expect(String(win.localStorage.nextId)).toBe('42');
    });

    test('saveState stores a paused timer with its remaining time', () => {
        const t = win.makeTimer('Paused', 5);
        t.isPaused    = true;
        t.remainingMs = 30_000;
        win.timers.push(t);
        win.saveState();
        const saved = JSON.parse(win.localStorage.timersState);
        expect(saved[0].isPaused).toBe(true);
        expect(saved[0].remainingMs).toBe(30_000);
    });

    test('loadState restores timers and returns true', () => {
        win.timers.push(win.makeTimer('Loaded', 3));
        win.saveState();
        win.timers.length = 0;
        expect(win.loadState()).toBe(true);
        expect(win.timers.length).toBe(1);
        expect(win.timers[0].name).toBe('Loaded');
    });

    test('loadState restores isPaused and remainingMs for a paused timer', () => {
        const t = win.makeTimer('Paused', 5);
        t.isPaused    = true;
        t.remainingMs = 30_000;
        win.timers.push(t);
        win.saveState();
        win.timers.length = 0;
        win.loadState();
        expect(win.timers[0].isPaused).toBe(true);
        expect(win.timers[0].remainingMs).toBe(30_000);
    });

    test('loadState derives endTime for a running timer from now + remainingMs', () => {
        win.timers.push(win.makeTimer('Running', 5));
        win.saveState();
        win.timers.length = 0;
        win.loadState();
        const loaded = win.timers[0];
        expect(loaded.isPaused).toBe(false);
        expect(Math.abs(loaded.endTime - (FIXED_NOW + loaded.remainingMs))).toBeLessThan(100);
    });

    test('loadState returns false when localStorage contains no timers state', () => {
        // Fresh JSDOM instance has an empty localStorage.
        const fresh = loadApp();
        fresh.timers.length = 0;
        expect(fresh.loadState()).toBe(false);
    });

    test('loadState returns false for malformed JSON in localStorage', () => {
        win.localStorage.timersState = 'NOT_JSON';
        expect(win.loadState()).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// loadLegacy
// ─────────────────────────────────────────────────────────────────────────────
describe('loadLegacy', () => {
    let win;
    beforeEach(() => {
        win = loadApp();
        win.timers.length = 0;
    });

    test('returns true and adds a timer when endTime is in the future', () => {
        win.localStorage.endTime = String(FIXED_NOW + 60_000);
        expect(win.loadLegacy()).toBe(true);
        expect(win.timers.length).toBe(1);
    });

    test('creates the timer with the correct remaining time', () => {
        const future = FIXED_NOW + 45_000;
        win.localStorage.endTime = String(future);
        win.loadLegacy();
        expect(win.timers[0].remainingMs).toBe(45_000);
        expect(win.timers[0].endTime).toBe(future);
    });

    test('returns false when no endTime key is present', () => {
        expect(win.loadLegacy()).toBe(false);
    });

    test('returns false and adds no timer when endTime is in the past', () => {
        win.localStorage.endTime = String(FIXED_NOW - 1_000);
        expect(win.loadLegacy()).toBe(false);
        expect(win.timers.length).toBe(0);
    });

    test('returns false when endTime is 0', () => {
        win.localStorage.endTime = '0';
        expect(win.loadLegacy()).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// handleUrlParams
// ─────────────────────────────────────────────────────────────────────────────
describe('handleUrlParams', () => {
    test('adds a timer when "minutes" param is present', () => {
        const win = loadApp('?minutes=10');
        const found = win.timers.find(t => t.totalMs === 10 * 60_000);
        expect(found).toBeDefined();
    });

    test('sets the timer name from the "name" param', () => {
        const win = loadApp('?minutes=5&name=Pomodoro');
        const found = win.timers.find(t => t.name === 'Pomodoro');
        expect(found).toBeDefined();
    });

    test('creates a timer with an empty name when "name" param is absent', () => {
        const win = loadApp('?minutes=5');
        const found = win.timers.find(t => t.totalMs === 5 * 60_000);
        expect(found).toBeDefined();
        expect(found.name).toBe('');
    });

    test('does NOT add a timer when "minutes" param is absent', () => {
        const win = loadApp('?name=Test');
        const found = win.timers.find(t => t.name === 'Test');
        expect(found).toBeUndefined();
    });

    test('does NOT add a timer when "minutes" is 0', () => {
        const win = loadApp('?minutes=0');
        const found = win.timers.find(t => t.totalMs === 0);
        expect(found).toBeUndefined();
    });

    test('does NOT add a timer when "minutes" is negative', () => {
        const win = loadApp('?minutes=-5');
        const found = win.timers.find(t => t.totalMs < 0);
        expect(found).toBeUndefined();
    });

    test('fractional minutes are supported', () => {
        const win = loadApp('?minutes=1.5');
        const found = win.timers.find(t => t.totalMs === 90_000);
        expect(found).toBeDefined();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Initial render behaviour
// ─────────────────────────────────────────────────────────────────────────────
describe('initial render', () => {
    test('shows the add-form when there are no timers on first load', () => {
        // Fresh JSDOM → empty localStorage → no timers → form should be visible.
        const win = loadApp();
        const form = win.document.getElementById('add-form');
        expect(form.classList.contains('visible')).toBe(true);
    });

    test('the timers container is present in the DOM', () => {
        const win = loadApp();
        expect(win.document.getElementById('timers')).not.toBeNull();
    });

    test('the control panel is present in the DOM', () => {
        const win = loadApp();
        expect(win.document.getElementById('control')).not.toBeNull();
    });

    test('theme-select defaults to empty string (Dark theme)', () => {
        const win = loadApp();
        expect(win.document.getElementById('theme-select').value).toBe('');
    });
});
