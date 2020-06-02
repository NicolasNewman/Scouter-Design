import { CoreTypeKeys, CoreTypes } from '../actions/core';

interface IInitialState {
    status: boolean;
}

const initialState: IInitialState = {
    status: false
};

export default function file(
    state: IInitialState = initialState,
    action: CoreTypes
) {
    switch (action.type) {
        case CoreTypeKeys.SET_PROJECT_STATUS:
            return {
                status: action.status
            };
        default:
            return state;
    }
}
