import { GroupOptions } from '../classes/models/FormGroup';
import { IInitialState as GameState } from '../reducers/game';
import FormGroup from '../classes/models/FormGroup';

export type GameProperties = {
    matchDuration: number;
    autoDuration: number;
    teleopDuration: number;
    endgameDuration: number;
};

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
    game: GameState;
    event: EventDataArray;
    state: StateDataArray;
    group: Array<GroupOptions>;
};

export type FormLayoutType = {
    rows: number;
    cols: number;
    gridModel: Array<Array<string>>;
    groupList: Array<FormGroup>;
};
