import * as React from 'react';
import { Component } from 'react';
// import { GroupProps } from './Group';
import Group from './Group';
import { IProps as IGroupProps } from './Group';
import { DropTarget, DropTargetMonitor, DropTargetConnector, DragElementWrapper } from 'react-dnd';
import FormGroup from '../classes/models/FormGroup';
import * as deepEquals from 'fast-deep-equal';

interface IBaseProps {
    gridAreaName: string;
    row: number;
    col: number;
    /** flag that tracks if the user is in the process of joining grids */
    isJoiningGrid: boolean;
    /** the corresponding letter this slot uses to be placed correctly on the grid */
    joinModel: string;
    /** the default component to display on the slot (if there is one) */
    inner?: FormGroup;
    /** function that handles what should happen when the slot is clicked on */
    joinClickHandler: () => void;
    /** function that allows access to the groupList within the FormCreator */
    updateGroupList: (group: FormGroup, gridAreaName: string) => void;
    removeGroupList: (group: FormGroup) => void;
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
    inner?: React.ReactElement<IGroupProps>;
    // inner?: React.Component<IGroupProps>;
}

class FormGridSlot extends Component<IProps, IState> {
    props: IProps;

    constructor(props) {
        super(props);
        if (this.props.inner) {
            // if a component has been pre-specified (ie from a loaded save), generate a group for it
            this.state = {
                inner: this.createInner()
            };
        } else {
            this.state = {};
        }
    }

    createInner = () => {
        return (
            <Group
                disabled={true}
                // FormGroup instance that this group should be generated from
                group={this.props.inner}
                // used by the close button on a group to remove it from the slot
                clear={() => {
                    this.props.removeGroupList(this.props.inner);
                    this.setState({ inner: null });
                }}
            />
        );
    };

    componentDidUpdate(prevProps: IProps) {
        // If the user changes the dimension of the grid, clear the inner group
        if (prevProps.row !== this.props.row || prevProps.col !== this.props.col) {
            this.setState({ inner: null });
        }

        // Update the slots inner group if there was a change in the prop's render button
        if (
            this.state.inner &&
            !deepEquals(this.props.inner.getRenderButtons(), this.state.inner.props.group.getRenderButtons())
        ) {
            this.setState({ inner: this.createInner() });
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

            let group: FormGroup = monitor.getItem().group;

            // create a deep-copy of the instance
            const clone = FormGroup.fromJSON(group.toJSON());
            component.props.updateGroupList(clone, component.props.gridAreaName);
            component.setState({
                inner: (
                    <Group
                        disabled={true}
                        // FormGroup instance that this group should be generated from
                        group={clone}
                        // used by the close button on a group to remove it from the slot
                        clear={() => {
                            component.props.removeGroupList(clone);
                            component.setState({ inner: null });
                        }}
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
