import { StateData, StateDataArray } from '../types/types';

export enum StateActionTypeKeys {
    ADD_STATE_ITEM = 'ADD_STATE_ITEM',
    REMOVE_STATE_ITEM = 'REMOVE_STATE_ITEM',
    UPDATE_STATE_ITEM = 'UPDATE_STATE_ITEM',
    OVERWRITE_STATE = 'OVERWRITE_STATE'
}

interface AddStateItemAction {
    type: StateActionTypeKeys.ADD_STATE_ITEM;
    state: StateData;
}

interface RemoveStateItemAction {
    type: StateActionTypeKeys.REMOVE_STATE_ITEM;
    state: StateData;
}

interface UpdateStateItemAction {
    type: StateActionTypeKeys.UPDATE_STATE_ITEM;
    name: string;
    newData: StateData;
}

interface OverwriteStateItemAction {
    type: StateActionTypeKeys.OVERWRITE_STATE;
    states: StateDataArray;
}

export type StateActionTypes =
    | AddStateItemAction
    | RemoveStateItemAction
    | UpdateStateItemAction
    | OverwriteStateItemAction;

export function addStateItem(state: StateData) {
    return {
        type: StateActionTypeKeys.ADD_STATE_ITEM,
        state
    };
}

export function removeStateItem(state: StateData) {
    return {
        type: StateActionTypeKeys.REMOVE_STATE_ITEM,
        state
    };
}

export function updateStateItem(name: string, newData: StateData) {
    return {
        type: StateActionTypeKeys.UPDATE_STATE_ITEM,
        name,
        newData
    };
}

export function overwriteStateItem(states: StateDataArray) {
    return {
        type: StateActionTypeKeys.OVERWRITE_STATE,
        states
    };
}

export default {
    addStateItem,
    removeStateItem,
    updateStateItem,
    overwriteStateItem
};
