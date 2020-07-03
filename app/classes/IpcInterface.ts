import { ipcRenderer } from 'electron';
import WorkspaceParser from './WorkspaceParser';

export default class IpcInterface {
    constructor(parser?: WorkspaceParser) {
        if (parser) {
            ipcRenderer.on('save', e => {});
        }
    }

    resizeWindow(width: number, height: number) {
        ipcRenderer.send('resize', width, height);
    }

    openFile(file: string) {
        ipcRenderer.send('open', file);
    }

    newFile(file: string) {
        ipcRenderer.send('new', file);
    }
}
