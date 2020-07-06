import { FileMode, WorkspaceType } from 'app/types/types';
import { overwriteEventItem } from '../actions/event';
import { overwriteStateItem } from '../actions/state';
import { overwriteGroup } from '../actions/group';
import FormGroup from './models/FormGroup';
import store from '../index';
import FormButton from './models/FormButton';
import * as fs from 'fs';

class WorkspaceReader {
    private path: string;

    constructor(path: string) {
        this.path = path;
    }

    load() {
        const encoded = fs.readFileSync(this.path, 'utf-8');
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
        console.log(`Decoded: ${decoded}`);
        const state: WorkspaceType = JSON.parse(decoded);
        console.log(state);
        const groupButtons = state.group.map(group =>
            FormGroup.fromJSON(group)
        );
        console.log(state);
        store.dispatch(overwriteEventItem(state.event));
        store.dispatch(overwriteStateItem(state.state));
        store.dispatch(overwriteGroup(groupButtons));
    }
}

class WorkspaceWriter {
    private path: string;

    constructor(path: string) {
        this.path = path;
    }

    save(data: WorkspaceType) {
        const json = JSON.stringify(data);
        console.log(`JSON data: ${json}`);
        const encoded = Buffer.from(json).toString('base64');
        fs.writeFile(this.path, encoded, err => {
            if (err) throw err;
        });
    }
}

export default class WorkspaceParser {
    private path: string;
    private reader: WorkspaceReader;
    private writer: WorkspaceWriter;

    constructor(path: string, mode: FileMode) {
        this.path = path;

        if (mode === 'w') {
            fs.writeFile(path, '', err => {
                if (err) throw err;
            });
        }

        this.reader = new WorkspaceReader(path);
        this.writer = new WorkspaceWriter(path);
    }

    getReader() {
        return this.reader;
    }

    getWriter() {
        return this.writer;
    }
}
