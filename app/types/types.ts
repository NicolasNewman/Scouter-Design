import { GroupOptions } from '../classes/models/FormGroup';

/* ====================
 *     Event types
 * ====================*/
export type EventType = 'robot_event' | 'team_event' | 'foul_event';

export type EventData = {
    name: string;
    type: EventType;
    accuracy: boolean;
    score: number;
};

export type EventDataArray = Array<EventData>;

/* ====================
 *     State types
 * ====================*/
export type StateData = {
    name: string;
};

export type StateDataArray = Array<StateData>;

/* ====================
 *     Misc types
 * ====================*/
export type FileMode = 'r' | 'w';
export type ButtonType = 'event' | 'state' | 'accuracy';

export type WorkspaceType = {
    event: EventDataArray;
    state: StateDataArray;
    group: Array<GroupOptions>;
};
