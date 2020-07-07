import * as React from 'react';
import { Component } from 'react';
import Grid from './Grid/Grid';
import RenderButton from './Grid/RenderButton';
import FormGroup from '../classes/models/FormGroup';

interface IProps {
    group: FormGroup;
    onClick: (obj: any) => void;
}

interface IState {}

export default class Group extends Component<IProps, IState> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
    }
    render() {
        return (
            <Grid
                gridAreaName="TODO"
                className="input-grid__child"
                cols={this.props.group.getCol()}
                rows={this.props.group.getRow()}
                templateArea={this.props.group.getTemplateArea()}
                gridElements={[
                    <div className="input-grid__title">
                        <p>{this.props.group.getName()}</p>
                    </div>,
                    // generate each button to display in the group preview
                    ...this.props.group
                        .getRenderButtons()
                        .map(obj => (
                            <RenderButton
                                label={obj.label}
                                gridAreaName={obj.gridAreaName}
                                disabled={false}
                                accuracy={obj.accuracy ? obj.accuracy : false}
                                clicked={() => this.props.onClick(obj)}
                            />
                        ))
                ]}
            />
        );
    }
}
