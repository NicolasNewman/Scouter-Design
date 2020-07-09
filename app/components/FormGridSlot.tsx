import * as React from 'react';
import { Component } from 'react';
// import { GroupProps } from './Group';
import Group from './Group';
import { DropTarget, DropTargetMonitor, DropTargetConnector, DragElementWrapper } from 'react-dnd';
import FormGroup from '../classes/models/FormGroup';

interface IBaseProps {
    gridAreaName: string;
    row: number;
    col: number;
    /** flag that tracks if the user is in the process of joining grids */
    isJoiningGrid: boolean;
    /** the corresponding letter this slot uses to be placed correctly on the grid */
    joinModel: string;
    /** function that handles what should happen when the slot is clicked on */
    joinClickHandler: () => void;
    updateGroupList: (group: FormGroup, gridAreaName: string) => void;
}

interface IProps extends IBaseProps {
    // styleOverride: React.CSSProperties;
    isOver: boolean;
    canDrop: boolean;
    itemType: any;
    dropResult: any;
    connectDropTarget: DragElementWrapper<any>;
}

interface IState {
    /** the inner component that should be displayed in each slot */
    inner?: React.ReactNode;
}

class FormGridSlot extends Component<IProps, IState> {
    props: IProps;

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps: IProps) {
        // If the user changes the dimension of the grid, clear the inner group
        if (prevProps.row !== this.props.row || prevProps.col !== this.props.col) {
            this.setState({ inner: null });
        }
        // if (!prevProps.isOver && this.props.isOver) {
        //     console.log(`Entered: ${this.props.gridAreaName}`);
        // }

        // if (prevProps.isOver && !this.props.isOver) {
        //     console.log(`Left: ${this.props.gridAreaName}`);
        // }
    }

    render() {
        let style: React.CSSProperties = { gridArea: this.props.gridAreaName };

        // change to green if the user is hovering over it
        if (this.props.isOver) {
            style['backgroundColor'] = 'rgba(0,255,50,0.5)';
        }

        // permenently change to green or yellow if the user has selected this instance's slot
        let className = '';
        if (this.props.joinModel === this.props.gridAreaName) {
            className = 'form-creator__dropzone--joined';
        } else if (this.props.isJoiningGrid) {
            className = 'form-creator__dropzone--join';
        }
        return this.props.connectDropTarget(
            <div
                className={className}
                style={style}
                onClick={this.props.isJoiningGrid ? this.props.joinClickHandler : () => {}}
            >
                {this.state.inner ? this.state.inner : null}
            </div>
        );
    }
}

export default DropTarget(
    'Group',
    {
        drop: (props: IBaseProps, monitor: DropTargetMonitor, component: FormGridSlot) => {
            console.log('========== DROP ==========');
            console.log(props);
            console.log(monitor);
            console.log(monitor.getItem());
            console.log(component);
            component.props.updateGroupList(monitor.getItem().group, component.props.gridAreaName);
            component.setState({
                inner: (
                    <Group
                        disabled={true}
                        // FormGroup instance that this group should be generated from
                        group={monitor.getItem().group}
                        // used by the close button on a group to remove it from the slot
                        clear={() => component.setState({ inner: null })}
                    />
                )
            });
            return {
                gridAreaName: props.gridAreaName
            };
        }
        // hover: (props: any, monitor: DropTargetMonitor) => {
        //     console.log('========== HOVER ==========');
        //     console.log(props);
        //     console.log(monitor);
        // }
    },
    (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType(),
        dropResult: monitor.getDropResult()
    })
)(FormGridSlot);
