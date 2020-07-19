import { ipcRenderer } from 'electron';
import WorkspaceParser from './WorkspaceParser';
import { WorkspaceType } from '../types/types';
import store from '../index';
import WorkspaceExporter from './WorkspaceExporter';
import { remote } from 'electron';
import { EXTENSION_SDC } from '../constants/constants';

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
                remote.dialog.showSaveDialog(
                    {
                        title: 'Test'
                    },
                    filename => {
                        if (filename) {
                            let fName = filename;
                            if (!fName.endsWith(EXTENSION_SDC)) {
                                fName = fName + EXTENSION_SDC;
                            }
                            exporter.setPath(fName);
                            const state = store.getState();
                            exporter.generateAndWrite(this.buildWorkspace(), state.form.generateForm);
                        }
                    }
                );
            });
        }
    }

    private buildWorkspace(): WorkspaceType {
        const state = store.getState();

        // extract the needed information to save from the form state
        const formLayout = state.form.formLayout;

        const savableFormLayout = {
            rows: formLayout.rows,
            cols: formLayout.cols,
            gridModel: formLayout.gridModel
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
