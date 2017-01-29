/**
 Preload file that will be executed in the renderer process
 */
import electron from 'electron';
import path from 'path';
import fs from 'fs';
// import watcher from 'clipboard-watch';
// var cw = watcher;

const { ipcRenderer, webFrame, clipboard } = electron;

const INJECT_JS_PATH = path.join(__dirname, '../../', 'inject/inject.js');

setNotificationCallback((title, opt) => {
    ipcRenderer.send('notification', title, opt);
});

function watched() {
    var vm = this;
    var loggedIn = false;

    vm.__defineSetter__('loggedIn', function(newValue) {
        console.log('LOGGED IN: ' + newValue);
        if (newValue) {
            ipcRenderer.send('logged-in');
        } else {
            ipcRenderer.send('logged-out');
        }
        loggedIn = newValue;
    });

    vm.__defineGetter__('loggedIn', function() {
        return loggedIn;
    });
};

window.forWrapper = new watched();

document.addEventListener('DOMContentLoaded', () => {
    // do things
    injectScripts();
    updateRxClipboardDataIfNeeded();
});

window.addEventListener('keydown', function(event) {
    var Util = {
        // http://stackoverflow.com/questions/17907445/how-to-detect-ie11#comment30165888_17907562
        // by rg89
        isIE: ((navigator.appName === 'Microsoft Internet Explorer') || ((navigator.appName === 'Netscape') && (new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent) !== null))),

        isEdge: (/Edge\/\d+/).exec(navigator.userAgent) !== null,

        // if firefox
        isFF: (navigator.userAgent.toLowerCase().indexOf('firefox') > -1),

        // http://stackoverflow.com/a/11752084/569101
        isMac: (window.navigator.platform.toUpperCase().indexOf('MAC') >= 0),

        // https://github.com/jashkenas/underscore
        // Lonely letter MUST USE the uppercase code
        keyCode: {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            ESCAPE: 27,
            SPACE: 32,
            DELETE: 46,
            K: 75, // K keycode, and not k
            M: 77,
            V: 86,
            C: 67
        }
    };

    function isMetaCtrlKey(event) {
        if ((Util.isMac && event.metaKey) || (!Util.isMac && event.ctrlKey)) {
            return true;
        }

        return false;
    }

    function getKeyCode(event) {
        var keyCode = event.which;

        // getting the key code from event
        if (null === keyCode) {
            keyCode = event.charCode !== null ? event.charCode : event.keyCode;
        }

        return keyCode;
    }

    function isKey(event, keys) {
        var keyCode = getKeyCode(event);

        // it's not an array let's just compare strings!
        if (false === Array.isArray(keys)) {
            return keyCode === keys;
        }

        if (-1 === keys.indexOf(keyCode)) {
            return false;
        }

        return true;
    }
    // if it's not Ctrl+C, do nothing
    if (!(isKey(event, Util.keyCode.C) && isMetaCtrlKey(event))) {
        console.debug('no copy action found, aborting', event, getKeyCode(event), isMetaCtrlKey(event));
        return;
    }

    var copiedText = window.getSelection().toString();

    console.debug('copied text: ', copiedText);

    window.rxClipboardData = copiedText;
});

window.addEventListener('focus', function(event) {
    updateRxClipboardDataIfNeeded();
});

function updateRxClipboardDataIfNeeded() {
    var clipboardText = clipboard.readText();

    if (!window.rxClipboardData || window.rxClipboardData !== clipboardText) {
        console.debug('updating clipboard data', clipboardText);
        window.rxClipboardData = clipboardText;
    }
}

ipcRenderer.on('params', (event, message) => {
    const appArgs = JSON.parse(message);
    console.log('nativefier.json', appArgs);
    window.rxWrapperArgs = appArgs;
});

ipcRenderer.on('change-zoom', (event, message) => {
    webFrame.setZoomFactor(message);
});

/**
 * Patches window.Notification to set a callback on a new Notification
 * @param callback
 */
function setNotificationCallback(callback) {

    const OldNotify = window.Notification;
    const newNotify = (title, opt) => {
        opt.icon = undefined;
        callback(title, opt);
        return new OldNotify(title, opt);
    };
    newNotify.requestPermission = OldNotify.requestPermission.bind(OldNotify);
    Object.defineProperty(newNotify, 'permission', {
        get: () => {
            return OldNotify.permission;
        }
    });

    window.Notification = newNotify;
}

function clickSelector(element) {
    const mouseEvent = new MouseEvent('click');
    element.dispatchEvent(mouseEvent);
}

function injectScripts() {
    const needToInject = fs.existsSync(INJECT_JS_PATH);
    if (!needToInject) {
        return;
    }
    require(INJECT_JS_PATH);
}