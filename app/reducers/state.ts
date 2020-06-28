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
            return state.filter(data => {
                return !(data.name === action.event.name);
            });
        case StateActionTypeKeys.UPDATE_STATE_ITEM:
            const filteredData = state.filter(data => {
                return !(data.name === action.name);
            });
            return [...filteredData, action.newData];
        case StateActionTypeKeys.OVERWRITE_STATE:
            return action.states;
        default:
            return state;
    }
}
