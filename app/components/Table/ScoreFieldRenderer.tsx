import * as React from 'react';
import { Component } from 'react';
import { InputNumber } from 'antd';

interface IProps {
    editing: boolean;
    score: Array<number>;
    changeHandler: (data: Array<number>) => void;
}

interface IState {
    autoScore: number;
    teleopScore: number;
    endgameScore: number;
}

export default class ScoreFieldRenderer extends Component<IProps, IState> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
        this.state = {
            autoScore: this.props.score[0],
            teleopScore: this.props.score[1],
            endgameScore: this.props.score[2]
        };
    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        const conA = prevState.autoScore !== this.state.autoScore;
        const conB = prevState.teleopScore !== this.state.teleopScore;
        const conC = prevState.endgameScore !== this.state.endgameScore;
        if (conA || conB || conC) {
            this.props.changeHandler([this.state.autoScore, this.state.teleopScore, this.state.endgameScore]);
        }
    }

    render() {
        return !this.props.editing ? (
            <div>
                <div className="f fp-flex-end fp-ycenter" style={{ margin: '0.75rem 0' }}>
                    <span style={{ marginRight: '0.5rem' }}>Auto:</span>
                    <InputNumber
                        defaultValue={this.props.score[0]}
                        onChange={(key: string) => {
                            this.setState({ autoScore: parseInt(key) ? parseInt(key) : 0 });
                        }}
                        key="auto"
                    />
                </div>
                <div className="f fp-flex-end fp-ycenter" style={{ margin: '0.75rem 0' }}>
                    <span style={{ marginRight: '0.5rem' }}>Teleop:</span>
                    <InputNumber
                        defaultValue={this.props.score[1]}
                        onChange={(key: string) => {
                            this.setState({ teleopScore: parseInt(key) ? parseInt(key) : 0 });
                        }}
                        key="teleop"
                    />
                </div>
                <div className="f fp-flex-end fp-ycenter" style={{ margin: '0.75rem 0' }}>
                    <span style={{ marginRight: '0.5rem' }}>Endgame:</span>
                    <InputNumber
                        defaultValue={this.props.score[2]}
                        onChange={(key: string) => {
                            this.setState({ endgameScore: parseInt(key) ? parseInt(key) : 0 });
                        }}
                        key="endgame"
                    />
                </div>
            </div>
        ) : (
            <span>{this.props.score.toString()}</span>
        );
    }
}
