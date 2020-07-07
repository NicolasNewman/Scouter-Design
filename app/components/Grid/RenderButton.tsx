import * as React from 'react';
import { Component } from 'react';

import { Button } from 'antd';

import { IGridElementProps } from './Grid';

interface IProps extends IGridElementProps {
    label: string;
    clicked?: () => void;
    color?: string;
    disabled?: boolean;
    accuracy: boolean;
}

export default class RenderButton extends Component<IProps> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        if (this.props.accuracy) {
            return (
                <div
                    style={{
                        gridArea: this.props.gridAreaName
                    }}
                >
                    <p
                        style={{
                            marginBottom: '5px',
                            color: '#555',
                            fontWeight: 600
                        }}
                    >
                        {this.props.label}
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Button
                            style={{
                                backgroundColor: '#00c06a',
                                marginLeft: '2px',
                                color: '#fff',
                                width: '45%'
                            }}
                            onClick={this.props.clicked}
                            disabled={this.props.disabled}
                        >
                            Hit
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#e60019',
                                marginRight: '2px',
                                width: '45%'
                            }}
                            onClick={this.props.clicked}
                            disabled={this.props.disabled}
                        >
                            Miss
                        </Button>
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    style={{
                        gridArea: this.props.gridAreaName
                    }}
                >
                    <Button
                        style={{
                            backgroundColor: '#0066b3',
                            borderColor: this.props.color
                        }}
                        onClick={this.props.clicked}
                        disabled={this.props.disabled}
                    >
                        {this.props.label}
                    </Button>
                </div>
            );
        }
    }
}
