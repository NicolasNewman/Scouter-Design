import { ipcRenderer } from 'electron';
import WorkspaceParser from './WorkspaceParser';
import { WorkspaceType } from '../types/types';
import store from '../index';
import WorkspaceExporter from './WorkspaceExporter';

export default class IpcInterface {
    constructor(parser?: WorkspaceParser, exporter?: WorkspaceExporter) {
        if (parser) {
            ipcRenderer.on('save', e => {
                console.log('====================');
                console.log('       Saving       ');
                console.log('====================');

                parser.getWriter().save(this.buildWorkspace());
            });
        }
        if (exporter) {
            ipcRenderer.on('export', e => {
                const state = store.getState();
                // console.log(state.form.generateForm());
                exporter.generateAndWrite(this.buildWorkspace(), state.form.generateForm);
            });
        }
    }

    private buildWorkspace(): WorkspaceType {
        const state = store.getState();

        // extract the needed information to save from the form state
        const formLayout = state.form.formLayout;
        // convert the form state's FormGroups to their JSON equivilent
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

        return cpy;
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
