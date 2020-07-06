import { ipcRenderer } from 'electron';
import WorkspaceParser from './WorkspaceParser';
import { WorkspaceType } from '../types/types';
import store from '../index';

export default class IpcInterface {
    constructor(parser?: WorkspaceParser) {
        if (parser) {
            ipcRenderer.on('save', e => {
                const state = store.getState();
                console.log('====================');
                console.log('       Saving       ');
                console.log('====================');
                console.log('Obtained state: ');
                console.log(state);
                const cpy: WorkspaceType = {
                    event: [...state.event],
                    state: [...state.state],
                    group: [...state.group.map(group => group.toJSON())]
                };
                console.log('Extracted data: ');
                console.log(cpy);
                parser.getWriter().save(cpy);
            });
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
