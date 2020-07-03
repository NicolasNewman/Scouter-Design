import { FileMode } from '../types/types';

export enum CoreTypeKeys {
    SET_PROJECT_FILE = 'SET_PROJECT_FILE'
}

interface SetProjectStatusAction {
    type: CoreTypeKeys.SET_PROJECT_FILE;
    file: string;
    mode: FileMode;
}

export type CoreTypes = SetProjectStatusAction;

export function setProjectFile(file: string, mode: FileMode) {
    return {
        type: CoreTypeKeys.SET_PROJECT_FILE,
        file,
        mode
    };
}

export default { setProjectFile };
