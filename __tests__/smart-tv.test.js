'use strict';

/**
 * Tests for smart-tv.js – the Samsung Smart TV localStorage polyfill.
 *
 * The polyfill activates only when:
 *   - typeof localStorage === "undefined"  (i.e. the native API is absent), AND
 *   - typeof FileSystem   === "function"   (i.e. the Samsung SDK is present).
 *
 * We use Node's built-in `vm` module to run the polyfill script inside a
 * sandboxed context where we control which globals are available, letting us
 * test every branch without a real Samsung TV runtime.
 */

const vm   = require('vm');
const fs   = require('fs');
const path = require('path');

const SMART_TV_CODE = fs.readFileSync(
    path.join(__dirname, '..', 'smart-tv.js'),
    'utf-8'
);

/**
 * Execute the smart-tv.js polyfill in a fresh VM sandbox and return the
 * sandbox (which doubles as the global/window object inside the script).
 *
 * @param {object} opts
 * @param {string}  opts.fileContent  JSON string stored in the fake DB file.
 * @param {boolean} opts.fileExists   Whether openCommonFile('r+') returns an object.
 * @param {boolean} opts.hasLocalStorage  Whether to expose a native localStorage
 *                                        (so the polyfill should NOT activate).
 * @param {boolean} opts.hasFileSystem    Whether to expose a FileSystem constructor
 *                                        (must be true for polyfill to activate).
 * @param {boolean} opts.executeSaveImmediately  When true (default) the setTimeout
 *                                        shim executes the callback synchronously.
 *                                        Set to false to use a jest.fn() that only
 *                                        records the call (useful when testing
 *                                        saveFile directly without a prior setItem
 *                                        already having flushed the dirty flag).
 * @returns {{ sandbox, writeAllSpy, openCommonFileSpy }}
 */
function runPolyfill({
    fileContent            = '{}',
    fileExists             = true,
    hasLocalStorage        = false,
    hasFileSystem          = true,
    executeSaveImmediately = true,
} = {}) {
    const writeAllSpy       = jest.fn();
    const closeCommonFileSpy = jest.fn();
    const openCommonFileSpy = jest.fn((name, mode) => {
        if (mode === 'r+') {
            return fileExists
                ? { readAll: () => fileContent, writeAll: writeAllSpy }
                : null;
        }
        // mode 'w' – used when creating a new file or saving
        return { readAll: () => '{}', writeAll: writeAllSpy };
    });

    const sandbox = {
        curWidget: { id: 'test-widget-1' },
        JSON,
        // setTimeout that executes the callback synchronously so tests stay simple.
        setTimeout: (fn) => fn(),
    };

    if (hasLocalStorage) {
        sandbox.localStorage = { getItem: () => null };
    }
    // Note: if hasLocalStorage is false, localStorage is simply absent from the
    // sandbox, so `typeof localStorage === "undefined"` is true.

    if (hasFileSystem) {
        // FileSystem is a constructor.  When called with `new`, the return value
        // of the constructor function IS used as the result when it's an object.
        sandbox.FileSystem = function MockFileSystem() {
            return { openCommonFile: openCommonFileSpy, closeCommonFile: closeCommonFileSpy };
        };
    }

    // `window` inside the script refers to the global object, which in the VM
    // context is the sandbox itself.
    sandbox.window = sandbox;

    // setTimeout shim: either execute synchronously (default) or just record
    // the call without running the callback.
    sandbox.setTimeout = executeSaveImmediately
        ? (fn) => fn()
        : jest.fn();

    vm.createContext(sandbox);
    vm.runInContext(SMART_TV_CODE, sandbox);

    return { sandbox, writeAllSpy, openCommonFileSpy, closeCommonFileSpy };
}

// ─────────────────────────────────────────────────────────────────────────────
// Activation guard
// ─────────────────────────────────────────────────────────────────────────────
describe('polyfill activation', () => {
    test('installs window.localStorage when localStorage is absent and FileSystem is present', () => {
        const { sandbox } = runPolyfill();
        expect(sandbox.window.localStorage).toBeDefined();
    });

    test('does NOT install a polyfill when native localStorage is already present', () => {
        const { sandbox } = runPolyfill({ hasLocalStorage: true });
        // window.localStorage should remain the original stub, not the polyfill
        expect(typeof sandbox.window.localStorage.setItem).toBe('undefined');
    });

    test('does NOT install a polyfill when FileSystem constructor is absent', () => {
        const { sandbox } = runPolyfill({ hasFileSystem: false });
        // sandbox.localStorage was never set by the polyfill
        expect(sandbox.localStorage).toBeUndefined();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// File I/O on initialisation
// ─────────────────────────────────────────────────────────────────────────────
describe('file initialisation', () => {
    test('reads existing file content when the DB file exists', () => {
        const { openCommonFileSpy } = runPolyfill({ fileContent: '{"key":"val"}' });
        const firstCall = openCommonFileSpy.mock.calls[0];
        expect(firstCall[1]).toBe('r+');
    });

    test('creates a new file with "{}" when the DB file does not exist', () => {
        const { writeAllSpy } = runPolyfill({ fileExists: false });
        expect(writeAllSpy).toHaveBeenCalledWith('{}');
    });

    test('falls back to an empty object when the file contains invalid JSON', () => {
        // The script wraps JSON.parse in try/catch; lStorage stays as `{}`.
        const { sandbox } = runPolyfill({ fileContent: 'NOT_JSON' });
        // setItem should still work (i.e. lStorage didn't crash)
        expect(() => sandbox.localStorage.setItem('x', '1')).not.toThrow();
    });

    test('closes the file after reading', () => {
        const { closeCommonFileSpy } = runPolyfill();
        expect(closeCommonFileSpy).toHaveBeenCalled();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// setItem
// ─────────────────────────────────────────────────────────────────────────────
describe('localStorage.setItem', () => {
    test('stores a value that can be retrieved with getItem', () => {
        const { sandbox } = runPolyfill();
        sandbox.localStorage.setItem('foo', 'bar');
        expect(sandbox.localStorage.getItem('foo')).toBe('bar');
    });

    test('returns the stored value', () => {
        const { sandbox } = runPolyfill();
        const result = sandbox.localStorage.setItem('k', 'v');
        expect(result).toBe('v');
    });

    test('overwrites a previously stored value', () => {
        const { sandbox } = runPolyfill();
        sandbox.localStorage.setItem('num', '1');
        sandbox.localStorage.setItem('num', '2');
        expect(sandbox.localStorage.getItem('num')).toBe('2');
    });

    test('triggers a deferred file save', () => {
        // Our setTimeout shim executes synchronously, so writeAllSpy is called
        // during setItem.
        const { sandbox, writeAllSpy } = runPolyfill({ fileExists: true });
        // Reset call count from init
        writeAllSpy.mockClear();
        sandbox.localStorage.setItem('x', 'y');
        expect(writeAllSpy).toHaveBeenCalled();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getItem
// ─────────────────────────────────────────────────────────────────────────────
describe('localStorage.getItem', () => {
    test('returns the value for a key that was set', () => {
        const { sandbox } = runPolyfill();
        sandbox.localStorage.setItem('answer', '42');
        expect(sandbox.localStorage.getItem('answer')).toBe('42');
    });

    test('returns undefined for a key that was never set', () => {
        const { sandbox } = runPolyfill();
        expect(sandbox.localStorage.getItem('missing')).toBeUndefined();
    });

    test('returns previously-persisted data loaded from the file', () => {
        // Simulate a file that already has data from a previous session.
        const { sandbox } = runPolyfill({ fileContent: '{"saved":"value"}' });
        expect(sandbox.localStorage.getItem('saved')).toBe('value');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// saveFile
// ─────────────────────────────────────────────────────────────────────────────
describe('localStorage.saveFile', () => {
    test('writes JSON to disk when called without a delay and data has changed', () => {
        // Use a non-executing setTimeout so the save queued by setItem doesn't
        // fire immediately, keeping changed = true for the explicit saveFile call.
        const { sandbox, writeAllSpy } = runPolyfill({ executeSaveImmediately: false });
        sandbox.localStorage.setItem('a', '1'); // marks changed = true
        writeAllSpy.mockClear();
        sandbox.localStorage.saveFile(false);   // direct call, no delay
        expect(writeAllSpy).toHaveBeenCalled();
        const written = writeAllSpy.mock.calls[0][0];
        expect(JSON.parse(written)).toMatchObject({ a: '1' });
    });

    test('does NOT write to disk when nothing has changed', () => {
        const { sandbox, writeAllSpy } = runPolyfill();
        // No setItem called → changed remains false.
        writeAllSpy.mockClear();
        sandbox.localStorage.saveFile(false);
        expect(writeAllSpy).not.toHaveBeenCalled();
    });

    test('uses setTimeout when delay is truthy', () => {
        // Use a non-executing setTimeout so we can verify it was invoked by setItem.
        const { sandbox } = runPolyfill({ executeSaveImmediately: false });
        const setTimeoutSpy = sandbox.setTimeout; // already a jest.fn()
        sandbox.localStorage.setItem('t', '1');   // calls saveFile(true) → setTimeout
        expect(setTimeoutSpy).toHaveBeenCalled();
    });

    test('serialises only data properties (not the methods themselves)', () => {
        const { sandbox, writeAllSpy } = runPolyfill({ executeSaveImmediately: false });
        sandbox.localStorage.setItem('myKey', 'myVal'); // changed = true
        writeAllSpy.mockClear();
        sandbox.localStorage.saveFile(false);
        const written = JSON.parse(writeAllSpy.mock.calls[0][0]);
        // Methods are functions – JSON.stringify omits them.
        expect(typeof written.setItem).toBe('undefined');
        expect(typeof written.getItem).toBe('undefined');
        expect(typeof written.saveFile).toBe('undefined');
        // But the data key should be present.
        expect(written.myKey).toBe('myVal');
    });
});
