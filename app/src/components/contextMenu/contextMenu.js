import electron from 'electron';
const {Menu, ipcMain, shell, BrowserWindow} = electron;

function initContextMenu(mainWindow) {
    ipcMain.on('contextMenuOpened', (event, targetHref) => {
        const contextMenuTemplate = [
            {
                label: 'Open in default browser',
                click: () => {
                    if (targetHref) {
                        shell.openExternal(targetHref);
                        return;
                    }
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Copy',
                role: 'copy'
            },
            {
                label: 'Paste',
                role: 'paste'
            }
        ];

        const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
        contextMenu.popup(mainWindow);
        mainWindow.contextMenuOpen = true;
    });
}

export default initContextMenu;
