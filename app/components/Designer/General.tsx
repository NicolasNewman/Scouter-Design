import * as React from 'react';
import { Component } from 'react';
import { Button, InputNumber, message } from 'antd';
import { GameProperties } from '../../types/types';

interface IProps {
    // redux - game
    gameProperties: GameProperties;
    setAllDurations: (
        matchDuration: number,
        autoDuration: number,
        teleopDuration: number,
        endgameDuration: number
    ) => void;
}

export default class General extends Component<IProps> {
    props: IProps;

    matchRef: React.RefObject<any>;
    autoRef: React.RefObject<any>;
    teleopRef: React.RefObject<any>;
    endgameRef: React.RefObject<any>;

    constructor(props, history) {
        super(props);

        this.matchRef = React.createRef();
        this.autoRef = React.createRef();
        this.teleopRef = React.createRef();
        this.endgameRef = React.createRef();
    }

    render() {
        return (
            <div className="f fp-center fp-col mt-5">
                <h3>Game Properties</h3>
                <div>
                    <span>Match Duration:</span>
                    <InputNumber defaultValue={this.props.gameProperties.matchDuration} ref={this.matchRef} />
                </div>
                <div>
                    <span>Autonomous Duration:</span>
                    <InputNumber defaultValue={this.props.gameProperties.autoDuration} ref={this.autoRef} />
                </div>
                <div>
                    <span>Teleoperation Duration:</span>
                    <InputNumber defaultValue={this.props.gameProperties.teleopDuration} ref={this.teleopRef} />
                </div>
                <div>
                    <span>Endgame Duration:</span>
                    <InputNumber defaultValue={this.props.gameProperties.endgameDuration} ref={this.endgameRef} />
                </div>
                <Button
                    className="mt-1"
                    onClick={() => {
                        const matchDuration = this.matchRef.current.state.value;
                        const autoDuration = this.autoRef.current.state.value;
                        const teleopDuration = this.teleopRef.current.state.value;
                        const endgameDuration = this.endgameRef.current.state.value;
                        const phaseSum = autoDuration + teleopDuration;
                        if (matchDuration === phaseSum) {
                            this.props.setAllDurations(matchDuration, autoDuration, teleopDuration, endgameDuration);
                        } else {
                            message.error(
                                `The sum of auto and teleop's duration (${phaseSum}) does not equal the match duration ${matchDuration}`
                            );
                        }
                    }}
                    type="primary"
                >
                    Save
                </Button>
            </div>
        );
    }
}
