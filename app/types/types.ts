import { GroupOptions } from '../classes/models/FormGroup';
import { IInitialState as GameState } from '../reducers/game';
import { IInitialState as FormState } from '../reducers/form';
import { IInitialState as CoreState } from '../reducers/core';
import FormGroup from '../classes/models/FormGroup';

export type GameProperties = {
    matchDuration: number;
    autoDuration: number;
    teleopDuration: number;
    endgameDuration: number;
};

/* ====================
 *     Redux types
 * ====================*/
export interface IStore {
    event: EventDataArray;
    state: StateDataArray;
    form: FormState;
    game: GameState;
    group: Array<FormGroup>;
    core: CoreState;
}

/* ====================
 *     Event types
 * ====================*/
export type EventType = 'robot_event' | 'team_event' | 'foul_event';

export type EventData = {
    name: string;
    type: EventType;
    accuracy: boolean;
    score: Array<number>;
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
export type ButtonType = 'event' | 'state' | 'accuracy' | 'team';

export type WorkspaceType = {
    game: GameState;
    event: EventDataArray;
    state: StateDataArray;
    group: Array<GroupOptions>;
    form: {
        rows: number;
        cols: number;
        gridModel: string[][];
    };
};

export type FormLayoutType = {
    rows: number;
    cols: number;
    gridModel: string[][];
};
