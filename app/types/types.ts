export type EventType = 'robot_event' | 'team_event' | 'foul_event';

export type EventData = {
    name: string;
    type: EventType;
    accuracy: boolean;
    score: number;
};

export type EventDataArray = Array<EventData>;

export type StateData = {
    name: string;
};

export type StateDataArray = Array<StateData>;
