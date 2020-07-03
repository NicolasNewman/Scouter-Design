import { CoreTypeKeys, CoreTypes } from '../actions/core';
import { FileMode } from '../types/types';

interface IInitialState {
    file: string;
    mode?: FileMode;
}

const initialState: IInitialState = {
    file: ''
};

export default function file(
    state: IInitialState = initialState,
    action: CoreTypes
) {
    switch (action.type) {
        case CoreTypeKeys.SET_PROJECT_FILE:
            return {
                file: action.file,
                mode: action.mode
            };
        default:
            return state;
    }
}
