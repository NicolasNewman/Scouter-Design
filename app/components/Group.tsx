import * as React from 'react';
import { Component } from 'react';
import Grid from './Grid/Grid';
import RenderButton from './Grid/RenderButton';
import FormGroup from '../classes/models/FormGroup';
import { DragElementWrapper, DragSourceOptions } from 'react-dnd';
import { CloseCircleOutlined } from '@ant-design/icons';

export interface IProps {
    group: FormGroup;
    disabled?: boolean;
    canDrag?: boolean;
    onClick?: (obj: any) => void;
    clear?: () => void;

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
                        style={this.props.canDrag ? { cursor: 'grab' } : { cursor: 'no-drop' }}
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
                </div>
            )
        ) : (
            <Grid
                gridAreaName="TODO"
                className="input-grid__child"
                cols={this.props.group.getCol()}
                rows={this.props.group.getRow()}
                templateArea={this.props.group.getTemplateArea()}
                style={{
                    position: 'relative'
                }}
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
                        )),
                    // if the group was created from the DraggableGroup injector, add a close button
                    this.props.clear ? (
                        <CloseCircleOutlined onClick={this.props.clear} className="btn-close" />
                    ) : (
                        <span></span>
                    )
                ]}
            />
        );
    }
}
