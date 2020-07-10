import { IInitialState as GameState } from '../reducers/game';

export enum GameTypeKeys {
    SET_MATCH_DURATION = 'SET_MATCH_DURATION',
    SET_AUTO_DURATION = 'SET_AUTO_DURATION',
    SET_TELEOP_DURATION = 'SET_TELEOP_DURATION',
    SET_ENDGAME_DURATION = 'SET_ENDGAME_DURATION',
    SET_ALL_DURATIONS = 'SET_ALL_DURATIONS',
    OVERWRITE = 'OVERWRITE'
}

interface SetMatchDuration {
    type: GameTypeKeys.SET_MATCH_DURATION;
    duration: number;
}

interface SetAutoDuration {
    type: GameTypeKeys.SET_AUTO_DURATION;
    duration: number;
}

interface SetTeleopDuration {
    type: GameTypeKeys.SET_TELEOP_DURATION;
    duration: number;
}

interface SetEndgameDuration {
    type: GameTypeKeys.SET_ENDGAME_DURATION;
    duration: number;
}

interface SetAllDurations {
    type: GameTypeKeys.SET_ALL_DURATIONS;
    matchDuration: number;
    autoDuration: number;
    teleopDuration: number;
    endgameDuration: number;
}

interface OverwriteGameState {
    type: GameTypeKeys.OVERWRITE;
    state: GameState;
}

export type GameTypes =
    | SetMatchDuration
    | SetAutoDuration
    | SetTeleopDuration
    | SetEndgameDuration
    | SetAllDurations
    | OverwriteGameState;

export function setMatchDuration(duration: number) {
    return {
        type: GameTypeKeys.SET_MATCH_DURATION,
        duration
    };
}

export function setAutoDuration(duration: number) {
    return {
        type: GameTypeKeys.SET_AUTO_DURATION,
        duration
    };
}

export function setTeleopDuration(duration: number) {
    return {
        type: GameTypeKeys.SET_TELEOP_DURATION,
        duration
    };
}

export function setEndgameDuration(duration: number) {
    return {
        type: GameTypeKeys.SET_ENDGAME_DURATION,
        duration
    };
}

export function setAllDurations(
    matchDuration: number,
    autoDuration: number,
    teleopDuration: number,
    endgameDuration: number
) {
    return {
        type: GameTypeKeys.SET_ALL_DURATIONS,
        matchDuration,
        autoDuration,
        teleopDuration,
        endgameDuration
    };
}

export function overwriteGameState(state: GameState) {
    return {
        type: GameTypeKeys.OVERWRITE,
        state
    };
}

export default {
    setMatchDuration,
    setAutoDuration,
    setTeleopDuration,
    setEndgameDuration,
    setAllDurations,
    overwriteGameState
};
