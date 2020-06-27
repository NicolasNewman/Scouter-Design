import { EventActionTypeKeys, EventActionTypes } from '../actions/event';
import { EventData, EventDataArray } from '../types/types';

const initialState: EventDataArray = [];

export default function event(
    state: EventDataArray = initialState,
    action: EventActionTypes
) {
    switch (action.type) {
        case EventActionTypeKeys.ADD_EVENT_ITEM:
            return [...state, action.event];
        case EventActionTypeKeys.REMOVE_EVENT_ITEM:
            return [];
        case EventActionTypeKeys.OVERWRITE_EVENT:
            return action.events;
        default:
            return state;
    }
}
