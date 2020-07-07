import * as React from 'react';
import { Component } from 'react';
// import { GroupProps } from './Group';
import Group from './Group';
import {
    DropTarget,
    DropTargetMonitor,
    DropTargetConnector,
    DragElementWrapper
} from 'react-dnd';

interface IBaseProps {
    gridAreaName: string;
    row: number;
    col: number;
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
    inner?: React.ReactNode;
}

class FormGridSlot extends Component<IProps, IState> {
    props: IProps;

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps: IProps) {
        if (
            prevProps.row !== this.props.row ||
            prevProps.col !== this.props.col
        ) {
            this.setState({ inner: null });
        }
        if (!prevProps.isOver && this.props.isOver) {
            console.log(`Entered: ${this.props.gridAreaName}`);
        }

        if (prevProps.isOver && !this.props.isOver) {
            console.log(`Left: ${this.props.gridAreaName}`);
        }
    }

    render() {
        let style: React.CSSProperties = { gridArea: this.props.gridAreaName };
        if (this.props.isOver) {
            style['backgroundColor'] = 'rgba(0,255,50,0.5)';
        }
        return this.props.connectDropTarget(
            <div style={style}>
                {this.state.inner ? this.state.inner : null}
            </div>
        );
    }
}

export default DropTarget(
    'Group',
    {
        drop: (
            props: IBaseProps,
            monitor: DropTargetMonitor,
            component: FormGridSlot
        ) => {
            console.log('========== DROP ==========');
            console.log(props);
            console.log(monitor);
            console.log(monitor.getItem());
            console.log(component);
            component.setState({
                inner: <Group group={monitor.getItem().group} />
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
