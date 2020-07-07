import Group, { IProps } from './Group';
import { DragSource, DragSourceMonitor, DragSourceConnector } from 'react-dnd';

export default DragSource(
    'Group',
    {
        beginDrag: (props: IProps, monitor: DragSourceMonitor) => {
            console.log('========== BEGIN DRAG ==========');
            console.log(props);
            console.log(monitor);
            return {
                group: props.group
            };
        },
        endDrag: (props: IProps, monitor: DragSourceMonitor) => {
            console.log('========== END DRAG ==========');
            console.log(props);
            console.log(monitor);
            console.log(monitor.didDrop());
            console.log(monitor.getDropResult());
        },
        canDrag: (props: IProps, monitor: DragSourceMonitor) => {
            console.log('========== CAN DRAG ==========');
            console.log(props);
            console.log(monitor);
            return props.canDrag !== null ? props.canDrag : true;
        }
    },
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    })
)(Group);
