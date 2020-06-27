import { EventData, EventDataArray } from '../types/types';

export enum EventActionTypeKeys {
    ADD_EVENT_ITEM = 'ADD_EVENT_ITEM',
    REMOVE_EVENT_ITEM = 'REMOVE_EVENT_ITEM',
    OVERWRITE_EVENT = 'OVERWRITE_EVENT'
}

interface AddEventItemAction {
    type: EventActionTypeKeys.ADD_EVENT_ITEM;
    event: EventData;
}

interface RemoveEventItemAction {
    type: EventActionTypeKeys.REMOVE_EVENT_ITEM;
    event: EventData;
}

interface OverwriteEventItemAction {
    type: EventActionTypeKeys.OVERWRITE_EVENT;
    events: EventDataArray;
}

export type EventActionTypes =
    | AddEventItemAction
    | RemoveEventItemAction
    | OverwriteEventItemAction;

export function addEventItem(event: EventData) {
    return {
        type: EventActionTypeKeys.ADD_EVENT_ITEM,
        event
    };
}

export function removeEventItem(event: EventData) {
    return {
        type: EventActionTypeKeys.REMOVE_EVENT_ITEM,
        event
    };
}

export function overwriteEventItem(events: EventDataArray) {
    return {
        type: EventActionTypeKeys.OVERWRITE_EVENT,
        events
    };
}

export default { addEventItem, removeEventItem, overwriteEventItem };
