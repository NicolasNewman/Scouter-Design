import { EventActionTypeKeys, EventActionTypes } from '../actions/event';
import { EventData, EventDataArray } from '../types/types';

const initialState: EventDataArray = [];

export default function event(state: EventDataArray = initialState, action: EventActionTypes) {
    switch (action.type) {
        case EventActionTypeKeys.ADD_EVENT_ITEM:
            return [...state, action.event];
        case EventActionTypeKeys.REMOVE_EVENT_ITEM:
            return state.filter(data => {
                return !(data.name === action.event.name);
            });
        case EventActionTypeKeys.UPDATE_EVENT_ITEM:
            //TODO dispatch event to update group render buttons
            const filteredData = state.filter(data => {
                return !(data.name === action.name);
            });
            return [...filteredData, action.newData];
        case EventActionTypeKeys.OVERWRITE_EVENT:
            return action.events;
        default:
            return state;
    }
}
