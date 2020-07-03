import { FileMode } from 'app/types/types';
import * as fs from 'fs';

class WorkspaceReader {
    private path: string;

    constructor(path: string) {
        this.path = path;
    }
}

class WorkspaceWriter {
    private path: string;

    constructor(path: string) {
        this.path = path;
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
