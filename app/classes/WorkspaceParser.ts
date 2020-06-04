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

    constructor(path: string) {
        this.path = path;
        this.reader = new WorkspaceReader(path);
        this.writer = new WorkspaceWriter(path);
    }
}
