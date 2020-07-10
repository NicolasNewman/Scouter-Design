import { GameTypeKeys, GameTypes } from '../actions/game';
import { GameProperties } from '../types/types';

export interface IInitialState {
    gameProperties: GameProperties;
}

const initialState: IInitialState = {
    gameProperties: {
        matchDuration: 150,
        autoDuration: 15,
        teleopDuration: 135,
        endgameDuration: 30
    }
};

export default function file(state: IInitialState = initialState, action: GameTypes) {
    switch (action.type) {
        case GameTypeKeys.SET_MATCH_DURATION:
            return {
                gameProperties: {
                    matchDuration: action.duration,
                    autoDuration: state.gameProperties.autoDuration,
                    teleopDuration: state.gameProperties.teleopDuration,
                    endgameDuration: state.gameProperties.endgameDuration
                }
            };
        case GameTypeKeys.SET_AUTO_DURATION:
            return {
                gameProperties: {
                    matchDuration: state.gameProperties.matchDuration,
                    autoDuration: action.duration,
                    teleopDuration: state.gameProperties.teleopDuration,
                    endgameDuration: state.gameProperties.endgameDuration
                }
            };
        case GameTypeKeys.SET_TELEOP_DURATION:
            return {
                gameProperties: {
                    matchDuration: state.gameProperties.matchDuration,
                    autoDuration: state.gameProperties.autoDuration,
                    teleopDuration: action.duration,
                    endgameDuration: state.gameProperties.endgameDuration
                }
            };
        case GameTypeKeys.SET_ENDGAME_DURATION:
            return {
                gameProperties: {
                    matchDuration: state.gameProperties.matchDuration,
                    autoDuration: state.gameProperties.autoDuration,
                    teleopDuration: state.gameProperties.teleopDuration,
                    endgameDuration: action.duration
                }
            };
        case GameTypeKeys.SET_ALL_DURATIONS:
            return {
                gameProperties: {
                    matchDuration: action.matchDuration,
                    autoDuration: action.autoDuration,
                    teleopDuration: action.teleopDuration,
                    endgameDuration: action.endgameDuration
                }
            };
        case GameTypeKeys.OVERWRITE:
            return action.state;
        default:
            return state;
    }
}
