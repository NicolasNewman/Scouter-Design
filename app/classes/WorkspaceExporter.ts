import { EventData, EventDataArray, StateData, StateDataArray, GameProperties, WorkspaceType } from '../types/types';

const gameTypeGenerator = (events: EventDataArray, states: StateDataArray, game: GameProperties) => {
    const appendEnum = (str: string, name: string): string => {
        return str + `${name} = "${name}",\n`;
    };
    let ERobotEvents = '';
    let EScorableRobotEvents = '';
    let ETeamEvents = '';
    let EScorableTeamEvents = '';
    let EFoulEvents = '';
    events.forEach(event => {
        switch (event.type) {
            case 'robot_event':
                if (event.score !== 0) {
                    EScorableRobotEvents = appendEnum(EScorableRobotEvents, event.name);
                } else {
                    ERobotEvents = appendEnum(ERobotEvents, event.name);
                }
                break;
            case 'team_event':
                if (event.score !== 0) {
                    EScorableTeamEvents = appendEnum(EScorableTeamEvents, event.name);
                } else {
                    ETeamEvents = appendEnum(ETeamEvents, event.name);
                }
                break;

            case 'foul_event':
                EFoulEvents = appendEnum(EFoulEvents, event.name);
                break;
        }
    });

    let ERobotStates = '';
    states.forEach(state => {
        ERobotStates = appendEnum(ERobotStates, state.name);
    });

    const IGameProperties = `
        matchDuration: ${game.matchDuration},
        autoDuration: ${game.autoDuration},
        teleopDuration: ${game.teleopDuration},
        endgameDuration: ${game.endgameDuration},
        auto: {start: ${0}, end: ${game.autoDuration}},
        teleop: {start: ${game.autoDuration}, end: ${game.autoDuration + game.teleopDuration}},
        endgame: {start: ${game.autoDuration + game.teleopDuration - game.endgameDuration}, end: ${game.autoDuration +
        game.teleopDuration}}`;

    return `
    import { ECustomEvents, ECustomStates } from "./customTypes";

    /*==============================
    ||     General Properties     ||
    ==============================*/

    export type Duration = {
        start?: number;
        end?: number;
    };

    export type Phase = "AUTO" | "TELEOP" | "ENDGAME";

    interface IGameProperties {
        matchDuration: number;
        autoDuration: number;
        teleopDuration: number;
        endgameDuration: number;
        auto: Duration;
        teleop: Duration;
        endgame: Duration;
    }

    /*==============================
    ||           Events           ||
    ==============================*/

    export enum ERobotEvents {
        ${ERobotEvents}
    }

    export enum EScorableRobotEvents {
        ${EScorableRobotEvents}
    }

    export enum EFoulEvents {
        ${EFoulEvents}
    }

    export enum ETeamEvents {
        ${ETeamEvents}
    }

    export enum EScorableTeamEvents {
        ${EScorableTeamEvents}
    }

    /*==============================
    ||           State            ||
    ==============================*/

    export enum ERobotStates {
        ${ERobotStates}
    }

    /*==============================
    ||           Types            ||
    ==============================*/

    export type RobotEvent =
        | ERobotEvents
        | EScorableRobotEvents
        | EFoulEvents
        | ECustomEvents;

    export type TeamEvent = ETeamEvents | EScorableTeamEvents;

    export type ScorableEvent = EScorableRobotEvents | EScorableTeamEvents;

    export type Event =
        | ERobotEvents
        | EScorableRobotEvents
        | EFoulEvents
        | ECustomEvents
        | ETeamEvents
        | EScorableTeamEvents;

    export type State = ERobotStates | ECustomStates;

    /*==============================
    ||     DB Model Interfaces    ||
    ==============================*/

    export interface IRobotEvent {
        type: RobotEvent;
        start: number;
        points?: number;
        success?: number;
    }

    export interface ITeamEvent {
        type: TeamEvent;
        start: number;
        points?: number;
    }

    export interface IRobotState {
        type: State;
        start?: number;
        end?: number;
    }

    /*==============================
    ||        Event Arrays        ||
    ==============================*/

    export const RobotEventList = [
        ...Object.values(ERobotEvents),
        ...Object.values(EScorableRobotEvents),
        ...Object.values(EFoulEvents),
        ...Object.values(ECustomEvents)
    ];

    export const TeamEventList = [
        ...Object.values(ETeamEvents),
        ...Object.values(EScorableTeamEvents)
    ];

    export const ScorableEventList = [
        ...Object.values(EScorableRobotEvents),
        ...Object.values(EScorableTeamEvents)
    ];

    export const EventList = [
        ...Object.values(ERobotEvents),
        ...Object.values(EScorableRobotEvents),
        ...Object.values(EFoulEvents),
        ...Object.values(ECustomEvents),
        ...Object.values(ETeamEvents),
        ...Object.values(EScorableTeamEvents)
    ];

    export const StateList = [
        ...Object.values(ERobotStates),
        ...Object.values(ECustomStates)
    ];

    /*==============================
    ||      Game Properties       ||
    ==============================*/

    export const gameProperties: IGameProperties = {
        ${IGameProperties}
    };

    // TODO
    export const cycleDeterminer = ERobotStates.GATHERING;
    `;
};

const accuracyResolverGenerator = (events: EventDataArray) => {
    const conditions = '';
    events.forEach(event => {
        if (event.accuracy) {
            conditions = conditions + `\ncase "${event.name}": return true;`;
        }
    });
    return `
    import { Event } from "./gameTypes";
    const resolveAccuracy = (event: Event): boolean => {
        switch (event) {
            ${conditions}
            default:
                return false;
        }
    }

    export default resolveAccuracy;
    `;
};

// TODO
const scoreResolverGenerator = (events: EventDataArray) => {
    const generateBranch = (name: string, score: number) => {
        return `
        case "${name}":
            switch (phase) {
                case "AUTO":
                    return ${score};
                case "TELEOP":
                    return ${score};
                case "ENDGAME":
                    return ${score};
                default:
                    return 0;
            }
        `;
    };
    const switchBranches = '';
    events.forEach(event => {
        if (event.score !== 0) {
            switchBranches = switchBranches + '\n' + generateBranch(event.name, event.score);
        }
    });

    return `
    import { Phase, Event } from "./gameTypes";

    const resolveScore = (event: Event, phase: Phase): number => {
        switch (event) {
            ${switchBranches}
            default:
                return 0;
        }
    };

    export default resolveScore
    `;
};

export default class WorkspaceExporter {
    private path: string;
    constructor(path?: string) {
        this.path = path ? path : '';
    }

    setPath(path: string) {
        this.path = path;
    }

    generateAndWrite(state: WorkspaceType, formGenerator: () => string) {
        const formCode = formGenerator();
        console.log(formCode);

        const gameTypeCode = gameTypeGenerator(state.event, state.state, state.game.gameProperties);
        console.log(gameTypeCode);

        const accuracyResolverCode = accuracyResolverGenerator(state.event);
        console.log(accuracyResolverCode);
    }
}
