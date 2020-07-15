import { EventData, EventDataArray, StateData, StateDataArray, GameProperties, WorkspaceType } from '../types/types';
import * as fs from 'fs';

const fullFormGenerator = (form: string): string => {
    return `
    import * as React from "react";
    import { Component } from "react";

    import {
        ScoutingTargets,
        SocketController,
        emitableEvents,
    } from "../../../classes/socketController";

    import Grid from "../../Grid/Grid";

    import StateButton from "./DataInputFormComponents/StateButton";

    import RequestHandler from "../../../classes/RequestHandler";
    import RobotEventButton from "./DataInputFormComponents/RobotEventButton";
    import AccuracyEventButton from "./DataInputFormComponents/AccuracyEventButton";
    import {
        ERobotEvents,
        EScorableRobotEvents,
        ETeamEvents,
        EScorableTeamEvents,
        EFoulEvents,
        ERobotStates,
    } from "../../../global/gameTypes";

    interface IProps {
        scoutingTargets: ScoutingTargets;
        matchNumber: number;
        socket: SocketController;
        requestHandler: RequestHandler;
        removeScoutingTarget: (target: string) => void;
        setMatchData: () => void;
    }

    /**
     * Stores constants that are needed by the event and state buttons
     */
    export interface IConstantProps {
        handler: RequestHandler;
        getTime: () => number;
        matchNumber: number;
        teamNumber: number;
    }

    interface IState {
        matchTime: number;
        phase: "NONE" | "AUTO" | "TELEOP" | "ENDGAME";
        autoButtonsDisabled: boolean;
        teleopButtonsDisabled: boolean;
        endgameButtonsDisabled: boolean;
        globalDisabled: boolean;
    }

    export default class Home extends Component<IProps, IState> {
        props: IProps;
        // Stores constants that are needed by the event and state buttons
        constantProps: IConstantProps;
        interval: NodeJS.Timeout;

        constructor(props: IProps) {
            super(props);

            if (this.props.scoutingTargets.length <= 0) {
            this.state = {
                matchTime: 0,
                phase: "NONE",
                autoButtonsDisabled: true,
                teleopButtonsDisabled: true,
                endgameButtonsDisabled: true,
                globalDisabled: true,
            };
            this.constantProps = {
                handler: this.props.requestHandler,
                getTime: this.getTime,
                matchNumber: this.props.matchNumber,
                teamNumber: -1,
            };
            } else {
            this.state = {
                matchTime: 0,
                phase: "NONE",
                autoButtonsDisabled: true,
                teleopButtonsDisabled: true,
                endgameButtonsDisabled: true,
                globalDisabled: false,
            };
            this.constantProps = {
                handler: this.props.requestHandler,
                getTime: this.getTime,
                matchNumber: this.props.matchNumber,
                teamNumber: parseInt(this.props.scoutingTargets[0].team),
            };
            }

            this.componentDidUpdate = () => {
            if (
                this.constantProps.teamNumber === -1 &&
                this.props.scoutingTargets.length > 0
            ) {
                this.constantProps.teamNumber = parseInt(
                this.props.scoutingTargets[0].team
                );
            }
            };

            // Initialize an interval to query the match time from the server
            if (this.props.scoutingTargets.length > 0) {
            this.interval = setInterval(() => {
                this.props.socket.emit(
                emitableEvents.getRemainingTime,
                undefined,
                (remainingTime: number, phase: "AUTO" | "TELEOP" | "ENDGAME") => {
                    if (remainingTime < 0) {
                    clearInterval(this.interval);
                    this.setState({
                        matchTime: 0,
                        phase: "NONE",
                        autoButtonsDisabled: true,
                        teleopButtonsDisabled: true,
                        endgameButtonsDisabled: true,
                        globalDisabled: true,
                    });

                    const identifier = \`\${
                        this.props.scoutingTargets[0].alliance === "red" ? "r" : "b"
                    }-\${this.props.scoutingTargets[0].seed}-scout\`;

                    this.props.socket.emit(
                        emitableEvents.scoutingFormSubmited,
                        identifier
                    );
                    } else {
                    this.setState({
                        matchTime: remainingTime,
                        phase,
                        autoButtonsDisabled: phase === "AUTO" ? false : true,
                        teleopButtonsDisabled: phase === "TELEOP" ? false : true,
                        endgameButtonsDisabled: phase === "ENDGAME" ? false : true,
                    });
                    }
                }
                );
            }, 500);
            }
        }

        getTime = (): number => {
            return this.state.matchTime;
        };

        render() {
            const scoutingTargets = this.props.scoutingTargets
            .map((obj) => {
                return obj.team;
            })
            .join(", ");
            return (
                <div className="scouting">
                    <Grid
                        className="dashboard"
                        templateArea="
                        'time phase'
                        'match team'"
                        rows="1fr 1fr"
                        cols="1fr 1fr"
                        gridElements={[
                            <h1 style={{ gridArea: "time" }}>Time: {this.state.matchTime}s</h1>,
                            <h1 style={{ gridArea: "phase" }}>Phase: {this.state.phase}</h1>,
                            <h2 style={{ gridArea: "match" }}>
                            Match: {this.props.matchNumber}
                            </h2>,
                            <h2 style={{ gridArea: "team" }}>Team: {scoutingTargets}</h2>,
                        ]}
                    />
                    ${form}
                </div>
            );
        }
    }`;
};

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
                if (event.score !== [0, 0, 0]) {
                    EScorableRobotEvents = appendEnum(EScorableRobotEvents, event.name);
                } else {
                    ERobotEvents = appendEnum(ERobotEvents, event.name);
                }
                break;
            case 'team_event':
                if (event.score !== [0, 0, 0]) {
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

    const cycleKey = `ERobotStates.${states[0].name}`;

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
        | EFoulEvents;

    export type TeamEvent = ETeamEvents | EScorableTeamEvents;

    export type ScorableEvent = EScorableRobotEvents | EScorableTeamEvents;

    export type Event =
        | ERobotEvents
        | EScorableRobotEvents
        | EFoulEvents
        | ETeamEvents
        | EScorableTeamEvents;

    export type State = ERobotStates;

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
        ...Object.values(EFoulEvents)
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
        ...Object.values(ETeamEvents),
        ...Object.values(EScorableTeamEvents)
    ];

    export const StateList = [
        ...Object.values(ERobotStates)
    ];

    /*==============================
    ||      Game Properties       ||
    ==============================*/

    export const gameProperties: IGameProperties = {
        ${IGameProperties}
    };

    // TODO
    export const cycleDeterminer = ${cycleKey};
    `;
};

const accuracyResolverGenerator = (events: EventDataArray) => {
    let conditions = '';
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
    const generateBranch = (name: string, score: Array<number>) => {
        return `
        case "${name}":
            switch (phase) {
                case "AUTO":
                    return ${score[0]};
                case "TELEOP":
                    return ${score[1]};
                case "ENDGAME":
                    return ${score[2]};
                default:
                    return 0;
            }
        `;
    };
    let switchBranches = '';
    events.forEach(event => {
        if (event.score !== [0, 0, 0]) {
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

    private encode(source: string) {
        return Buffer.from(source).toString('base64');
    }

    generateAndWrite(state: WorkspaceType, formGenerator: () => string) {
        const formCode = fullFormGenerator(formGenerator());
        console.log(formCode);

        const gameTypeCode = gameTypeGenerator(state.event, state.state, state.game.gameProperties);
        console.log(gameTypeCode);

        const accuracyResolverCode = accuracyResolverGenerator(state.event);
        console.log(accuracyResolverCode);

        const scoreResolverCode = scoreResolverGenerator(state.event);
        console.log(scoreResolverCode);

        if (this.path) {
            const formEncoded = this.encode(formCode);
            console.log(formEncoded);
            const gameTypeEncoded = this.encode(gameTypeCode);
            console.log(gameTypeEncoded);
            const accuracyResolverEncoded = this.encode(accuracyResolverCode);
            console.log(accuracyResolverEncoded);
            const scoreResolverEncoded = this.encode(scoreResolverCode);
            console.log(scoreResolverEncoded);

            const toWrite = `${formEncoded}$#$${gameTypeEncoded}$#$${accuracyResolverEncoded}$#$${scoreResolverEncoded}`;
            console.log(toWrite);
            fs.writeFile(this.path, toWrite, err => {
                if (err) throw err;
            });
        }
    }
}
