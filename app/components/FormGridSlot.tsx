import * as React from 'react';
import { Component } from 'react';
// import { GroupProps } from './Group';
import Group from './Group';
import { DropTarget, DropTargetMonitor, DropTargetConnector, DragElementWrapper } from 'react-dnd';

interface IBaseProps {
    gridAreaName: string;
    row: number;
    col: number;
    isJoiningGrid: boolean;
    joinModel: string;
    joinClickHandler: () => void;
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
        if (prevProps.row !== this.props.row || prevProps.col !== this.props.col) {
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

        let className = '';
        // console.log(
        //     `joinModel[${this.props.row - 1}][${this.props.col - 1}] = ${
        //         this.props.joinModel[this.props.row - 1][this.props.col - 1]
        //     } === ${this.props.gridAreaName}`
        // );
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
            component.setState({
                inner: (
                    <Group
                        disabled={true}
                        group={monitor.getItem().group}
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
