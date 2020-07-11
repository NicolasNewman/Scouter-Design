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

                const formLayout = state.form.formLayout;
                const convertedGroupList = state.form.formLayout.groupList.map(group => group.toJSON());
                const savableFormLayout = {
                    rows: formLayout.rows,
                    cols: formLayout.cols,
                    gridModel: formLayout.gridModel,
                    groupList: convertedGroupList
                };

                const cpy: WorkspaceType = {
                    game: state.game,
                    event: [...state.event],
                    state: [...state.state],
                    group: [...state.group.map(group => group.toJSON())],
                    form: savableFormLayout
                };

                console.log('Extracted data: ');
                console.log(cpy);
                parser.getWriter().save(cpy);
            });
            ipcRenderer.on('export', e => {
                const state = store.getState();
                console.log(state.form.generateForm());
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
