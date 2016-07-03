import fs from 'fs';
import path from 'path';
import electron from 'electron';
import windowStateKeeper from 'electron-window-state';
import helpers from './../../helpers/helpers';
import createMenu from './../menu/menu';
import initContextMenu from './../contextMenu/contextMenu';

const {BrowserWindow, shell, ipcMain, dialog} = electron;
const {isOSX, linkIsInternal, getCssToInject} = helpers;

const ZOOM_INTERVAL = 0.1;

const loginWidth = 475;
const loginHeight = 560;
const defaultWidth = 1300;
const defaultHeight = 780;
const minWidth = 1024;
const minHeight = 668;

var savedWindowSize = undefined;
var myDictionary = null;

/**
 *
 * @param {{}} options AppArgs from nativefier.json
 * @param {function} onAppQuit
 * @param {function} setDockBadge
 * @returns {electron.BrowserWindow}
 */
function createMainWindow(options, onAppQuit, setDockBadge) {
    const mainWindowState = windowStateKeeper({
        defaultWidth: 1300,
        defaultHeight: 780
    });

    const mainWindow = new BrowserWindow({
        frame: !options.hideWindowFrame,
        width: mainWindowState.width,
        minWidth: 1024,
        height: mainWindowState.height,
        minHeight: 668,
        x: mainWindowState.x,
        y: mainWindowState.y,
        'auto-hide-menu-bar': !options.showMenuBar,
        // Convert dashes to spaces because on linux the app name is joined with dashes
        title: options.name,
        'web-preferences': {
            javascript: true,
            plugins: true,
            // node globals causes problems with sites like messenger.com
            nodeIntegration: false,
            webSecurity: !options.insecure,
            preload: path.join(__dirname, 'static', 'preload.js'),
            allowDisplayingInsecureContent: true
        },
        // after webpack path here should reference `resources/app/`
        icon: path.join(__dirname, '../', '/icon.png'),
        // set to undefined and not false because explicitly setting to false will disable full screen
        fullscreen: options.fullScreen || undefined
    });

    mainWindowState.manage(mainWindow);

    // after first run, no longer force full screen to be true
    if (options.fullScreen) {
        options.fullScreen = undefined;
        fs.writeFileSync(path.join(__dirname, '..', 'nativefier.json'), JSON.stringify(options));
    }

    // after first run, no longer force maximize to be true
    if (options.maximize) {
        mainWindow.maximize();
        options.maximize = undefined;
        fs.writeFileSync(path.join(__dirname, '..', 'nativefier.json'), JSON.stringify(options));
    }

    let currentZoom = 1;

    const onZoomIn = () => {
        currentZoom += ZOOM_INTERVAL;
        mainWindow.webContents.send('change-zoom', currentZoom);
    };

    const onZoomOut = () => {
        currentZoom -= ZOOM_INTERVAL;
        mainWindow.webContents.send('change-zoom', currentZoom);
    };

    const clearAppData = () => {
        dialog.showMessageBox(mainWindow, {
            type: 'warning',
            buttons: ['Yes', 'Cancel'],
            defaultId: 1,
            title: 'Clear cache confirmation',
            message: 'This will clear all data (cookies, local storage etc) from this app. Are you sure you wish to proceed?'
        }, response => {
            if (response === 0) {
                const session = mainWindow.webContents.session;
                session.clearStorageData(() => {
                    session.clearCache(() => {
                        mainWindow.loadURL(options.targetUrl);
                    });
                });
            }
        });
    };

    const onGoBack = () => {
        mainWindow.webContents.goBack();
    };

    const onGoForward = () => {
        mainWindow.webContents.goForward();
    };

    const getCurrentUrl = () => {
        return mainWindow.webContents.getURL();
    };

    const menuOptions = {
        nativefierVersion: options.nativefierVersion,
        appQuit: onAppQuit,
        zoomIn: onZoomIn,
        zoomOut: onZoomOut,
        goBack: onGoBack,
        goForward: onGoForward,
        getCurrentUrl: getCurrentUrl,
        clearAppData: clearAppData
    };

    createMenu(menuOptions);
    if (!options.disableContextMenu) {
        initContextMenu(mainWindow);
    }

    if (options.userAgent) {
        mainWindow.webContents.setUserAgent(options.userAgent);
    }

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('params', JSON.stringify(options));
    });

    if (options.counter) {
        mainWindow.on('page-title-updated', () => {

            if (options.counter) {
                setTimeout(function(){
                    const itemCountRegex = /\((\d*?\+?)\)/;
                    const match = itemCountRegex.exec(mainWindow.getTitle());
                    if (match) {
                        setDockBadge(match[1]);
                    } else {
                        setDockBadge('');
                    }
                    return;
                }, 1000);
            }
        });
    }

    mainWindow.loadURL(options.targetUrl);

    mainWindow.on('close', event => {
        if (mainWindow.isFullScreen()) {
            mainWindow.setFullScreen(false);
            mainWindow.once('leave-full-screen', maybeHideWindow.bind(this, mainWindow, event));
        }
        maybeHideWindow(mainWindow, event);
    });

    // ** NEED THIS? **
    var handleRedirect = (event, urlToGo) => {
        var isLinkInternal = linkIsInternal(options.targetUrl, urlToGo);
        // external link
        if(!isLinkInternal) {
            event.preventDefault();
            require('electron').shell.openExternal(urlToGo);
        }
    }

    ipcMain.on('logged-in', function() {
        if (mainWindow.getSize()[0] === loginWidth && mainWindow.getSize()[1] === loginHeight) {
            savedWindowSize = savedWindowSize || [0, 0];
            savedWindowSize[0] = savedWindowSize[0] > minWidth ? savedWindowSize[0] : defaultWidth;
            savedWindowSize[1] = savedWindowSize[1] > minHeight ? savedWindowSize[1] : defaultHeight;
            mainWindow.setSize(savedWindowSize[0], savedWindowSize[1], false);
        }

        mainWindow.setResizable(true);
        mainWindow.center();
    });

    ipcMain.on('logged-out', function() {
        setTimeout(function(){
            if (getCurrentUrl().indexOf('home') === -1) {
                savedWindowSize = mainWindow.getSize();
                mainWindow.setSize(loginWidth, loginHeight, false);
                mainWindow.setResizable(false);
                mainWindow.center();
            }
        }, 500);
    });

    mainWindow.webContents.on('will-navigate', handleRedirect);
    mainWindow.webContents.on('new-window', handleRedirect);

    return mainWindow;
}

ipcMain.on('cancelNewWindowOverride', () => {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach(window => {
        window.useDefaultWindowBehaviour = false;
    });
});

ipcMain.on('checkspell', function(event, word) {
    var res = null;
    if(myDictionary != null && word != null) {
        res = myDictionary.spellCheck(word);
    }
    event.returnValue = false;
});

function maybeHideWindow(window, event) {
    if (isOSX()) {
        // this is called when exiting from clicking the cross button on the window
        event.preventDefault();
        window.hide();
    }
    // will close the window on other platforms
}

export default createMainWindow;
