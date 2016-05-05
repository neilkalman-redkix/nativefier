import electron from 'electron';
const {Menu, ipcMain, shell, BrowserWindow} = electron;

function initContextMenu(mainWindow) {
    ipcMain.on('contextMenuOpened', (event, targetHref) => {
        const contextMenuTemplate = [
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
