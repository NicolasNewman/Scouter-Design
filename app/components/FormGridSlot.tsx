import * as React from 'react';
import { Component } from 'react';
// import { GroupProps } from './Group';
import {
    DropTarget,
    DropTargetMonitor,
    DropTargetConnector,
    DragElementWrapper
} from 'react-dnd';

interface IProps {
    isOver?: boolean;
    canDrop?: boolean;
    itemType?: any;
    dropResult?: any;
    connectDropTarget?: DragElementWrapper<any>;
}

class FormGridSlot extends Component<IProps> {
    props: IProps;

    constructor(props) {
        super(props);
    }

    render() {
        return this.props.connectDropTarget(<div>SLOT</div>);
    }
}

export default DropTarget(
    'Group',
    {
        drop: (props: any, monitor: DropTargetMonitor) => {
            console.log('========== DROP ==========');
            console.log(props);
            console.log(monitor);
        }
    },
    (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType(),
        dropResult: monitor.getDropResult()
    })
)(FormGridSlot);
