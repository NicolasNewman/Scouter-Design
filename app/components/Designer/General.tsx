import * as React from 'react';
import { Component } from 'react';
import { Button, InputNumber, message } from 'antd';
import { GameProperties } from '../../types/types';
import * as deepEqual from 'fast-deep-equal';

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

interface IState {
    matchDuration: number;
    autoDuration: number;
    teleopDuration: number;
    endgameDuration: number;
}

export default class General extends Component<IProps, IState> {
    props: IProps;

    constructor(props, history) {
        super(props);
        console.log(props);

        this.state = {
            matchDuration: this.props.gameProperties.matchDuration,
            autoDuration: this.props.gameProperties.autoDuration,
            teleopDuration: this.props.gameProperties.teleopDuration,
            endgameDuration: this.props.gameProperties.endgameDuration
        };
    }

    componentDidUpdate(prevProps: IProps) {
        console.log('Prev props: ');
        console.log(prevProps);
        console.log(this.props);
        if (!deepEqual(prevProps.gameProperties, this.props.gameProperties)) {
            this.setState({
                matchDuration: this.props.gameProperties.matchDuration,
                autoDuration: this.props.gameProperties.autoDuration,
                teleopDuration: this.props.gameProperties.teleopDuration,
                endgameDuration: this.props.gameProperties.endgameDuration
            });
        }
    }

    render() {
        return (
            <div className="f fp-center fp-col mt-5">
                <h3>Game Properties</h3>
                <div>
                    <span>Match Duration:</span>
                    <InputNumber
                        onChange={value => this.setState({ matchDuration: parseInt(value.toString()) })}
                        value={this.state.matchDuration}
                    />
                </div>
                <div>
                    <span>Autonomous Duration:</span>
                    <InputNumber
                        onChange={value => this.setState({ autoDuration: parseInt(value.toString()) })}
                        value={this.state.autoDuration}
                    />
                </div>
                <div>
                    <span>Teleoperation Duration:</span>
                    <InputNumber
                        onChange={value => this.setState({ teleopDuration: parseInt(value.toString()) })}
                        value={this.state.teleopDuration}
                    />
                </div>
                <div>
                    <span>Endgame Duration:</span>
                    <InputNumber
                        onChange={value => this.setState({ endgameDuration: parseInt(value.toString()) })}
                        value={this.state.endgameDuration}
                    />
                </div>
                <Button
                    className="mt-1"
                    onClick={() => {
                        const matchDuration = this.state.matchDuration;
                        const autoDuration = this.state.autoDuration;
                        const teleopDuration = this.state.teleopDuration;
                        const endgameDuration = this.state.endgameDuration;
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
