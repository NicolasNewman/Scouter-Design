import * as React from 'react';
import { Component } from 'react';

import { Button } from 'antd';

import { IGridElementProps } from './Grid';

interface IProps extends IGridElementProps {
    label: string;
    color?: string;
    disabled?: boolean;
}

export default class RenderButton extends Component<IProps> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
    }

    clicked = () => {};

    render() {
        return (
            <div
                style={{
                    gridArea: this.props.gridAreaName
                }}
            >
                <Button
                    style={{
                        backgroundColor: this.props.color,
                        borderColor: this.props.color
                    }}
                    onClick={this.clicked}
                    disabled={this.props.disabled}
                >
                    {this.props.label}
                </Button>
            </div>
        );
    }
}
