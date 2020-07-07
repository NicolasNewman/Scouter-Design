import * as React from 'react';
import { Component } from 'react';
import Grid from './Grid/Grid';
import RenderButton from './Grid/RenderButton';
import FormGroup from '../classes/models/FormGroup';
import { DragElementWrapper, DragSourceOptions } from 'react-dnd';

export interface IProps {
    group: FormGroup;
    disabled?: boolean;
    canDrag?: boolean;
    onClick?: (obj: any) => void;

    isDragging?: boolean;
    connectDragSource?: DragElementWrapper<DragSourceOptions>;
}

interface IState {}

export default class Group extends Component<IProps, IState> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
    }
    render() {
        return this.props.connectDragSource ? (
            this.props.connectDragSource(
                <div>
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
                                        disabled={this.props.disabled}
                                        accuracy={
                                            obj.accuracy ? obj.accuracy : false
                                        }
                                        clicked={() => this.props.onClick(obj)}
                                    />
                                ))
                        ]}
                    />
                </div>
            )
        ) : (
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
                                disabled={this.props.disabled}
                                accuracy={obj.accuracy ? obj.accuracy : false}
                                clicked={() => this.props.onClick(obj)}
                            />
                        ))
                ]}
            />
        );
    }
}
