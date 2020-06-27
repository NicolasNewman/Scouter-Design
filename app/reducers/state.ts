import { StateActionTypeKeys, StateActionTypes } from '../actions/state';
import { StateData, StateDataArray } from '../types/types';

const initialState: StateDataArray = [];

export default function state(
    state: StateDataArray = initialState,
    action: StateActionTypes
) {
    switch (action.type) {
        case StateActionTypeKeys.ADD_STATE_ITEM:
            return [...state, action.state];
        case StateActionTypeKeys.REMOVE_STATE_ITEM:
            return [];
        case StateActionTypeKeys.OVERWRITE_STATE:
            return action.states;
        default:
            return state;
    }
}
