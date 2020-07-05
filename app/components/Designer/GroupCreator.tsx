import * as React from 'react';
import { Component } from 'react';
import { EventDataArray, StateDataArray } from 'app/types/types';
import { Button, Select, Modal, Input, InputNumber, Checkbox } from 'antd';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import FormGroup from '../../classes/models/FormGroup';
import { toCamelCase } from '../../utils/helper';
import Grid from '../Grid/Grid';
import RenderButton from '../Grid/RenderButton';
import { EventData, StateData } from '../../types/types';
import * as deepEqual from 'fast-deep-equal';

interface IProps {
    // redux - event
    events: EventDataArray;

    // redux - state
    states: StateDataArray;

    // redux - group
    groups: Array<FormGroup>;
    addGroup: (group: FormGroup) => void;
    removeGroup: (group: FormGroup) => void;
    updateGroup: (key: string, newGroup: FormGroup) => void;
    overwriteGroup: (groups: Array<FormGroup>) => void;
}

interface IState {
    modalVisible: boolean;
    targetGroup: FormGroup;
    targetButton: string;
}

export default class GroupCreator extends Component<IProps, IState> {
    props: IProps;
    typeOptions: Array<EventData | StateData>;

    input: React.RefObject<Input>;

    rowRef: React.RefObject<any>;
    colRef: React.RefObject<any>;

    typeRef: React.RefObject<Select>;
    disabledRef: React.RefObject<CheckboxGroup>;

    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            modalVisible: false,
            targetGroup: null,
            targetButton: null
        };
        this.typeOptions = [];

        this.input = React.createRef();

        this.rowRef = React.createRef();
        this.colRef = React.createRef();

        this.typeRef = React.createRef();
        this.disabledRef = React.createRef();
    }

    componentDidMount() {
        this.typeOptions = [];
        this.props.events.forEach(event => {
            this.typeOptions.push(event);
        });
        this.props.states.forEach(state => {
            this.typeOptions.push(state);
        });
    }

    shouldComponentUpdate(nextProps: IProps) {
        const conA = deepEqual(this.props.events, nextProps.events);
        const conB = deepEqual(this.props.states, this.props.events);
        if (!(conA && conB)) {
            this.typeOptions = [];
            nextProps.events.forEach(event => {
                this.typeOptions.push(event);
            });
            nextProps.states.forEach(state => {
                this.typeOptions.push(state);
            });
        }

        return true;
    }

    addGroup = () => {
        const name = this.input.current.state.value;
        const camalized = toCamelCase(name);
        const group = new FormGroup({ name, gridAreaName: camalized });
        this.props.addGroup(group);
        this.setState({
            modalVisible: false
        });
    };

    render() {
        return (
            <div className="group-creator">
                <Modal
                    title="Group name?"
                    visible={this.state.modalVisible}
                    onOk={this.addGroup}
                    onCancel={() => this.setState({ modalVisible: false })}
                >
                    <Input placeholder="Group name" ref={this.input}></Input>
                </Modal>
                <div className="group-creator__groups">
                    <div className="group-creator__groups--manage">
                        <Button
                            className="mr-1"
                            type="primary"
                            onClick={() =>
                                this.setState({ modalVisible: true })
                            }
                        >
                            +
                        </Button>
                        <Button className="mr-1" type="primary" danger>
                            -
                        </Button>
                        <Select
                            className="w-7"
                            // Function that handles when the selected group is changed
                            onChange={val => {
                                const targetGroup = this.props.groups.find(
                                    group => group.getName() === val
                                );
                                this.setState({
                                    targetGroup
                                });

                                const rowCount = targetGroup.getRowCount();
                                const colCount = targetGroup.getColCount();
                                this.rowRef.current.setState({
                                    inputValue: `${rowCount - 1}`,
                                    value: rowCount - 1
                                });
                                this.colRef.current.setState({
                                    inputValue: `${colCount}`,
                                    value: colCount
                                });
                            }}
                            options={this.props.groups.map(group => {
                                return {
                                    key: group.getGridAreaName(),
                                    value: group.getName()
                                };
                            })}
                        />
                    </div>
                    <div
                        className="group-creator__groups--modify mt-2"
                        hidden={this.state.targetGroup === null}
                    >
                        <div>
                            <p>
                                {this.state.targetGroup !== null
                                    ? this.state.targetGroup.getName()
                                    : ''}
                            </p>
                        </div>
                        <div>
                            <span>Rows: </span>
                            <InputNumber
                                ref={this.rowRef}
                                min={1}
                                className="w-3 mr-1"
                            />
                            <span>Cols: </span>
                            <InputNumber
                                ref={this.colRef}
                                min={1}
                                className="w-3"
                            />
                        </div>
                        <div className="mt-1">
                            <Button
                                // Function to handle updating a groups data
                                onClick={e => {
                                    const rows =
                                        this.rowRef.current.state.value + 1;
                                    const cols = this.colRef.current.state
                                        .value;
                                    this.state.targetGroup.setRowCount(rows);
                                    this.state.targetGroup.setColCount(cols);
                                    console.log(
                                        this.state.targetGroup.toString()
                                    );

                                    this.props.updateGroup(
                                        this.state.targetGroup.getGridAreaName(),
                                        this.state.targetGroup
                                    );
                                }}
                                type="primary"
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="group-creator__builder">
                    {this.state.targetGroup !== null ? (
                        <Grid
                            gridAreaName="TODO"
                            className="input-grid__child"
                            cols={this.colRef.current.state}
                            rows={this.rowRef.current.state}
                            templateArea={this.state.targetGroup.getTemplateArea()}
                            gridElements={[
                                <div className="input-grid__title">
                                    <p>{this.state.targetGroup.getName()}</p>
                                </div>,
                                ...this.state.targetGroup
                                    .getRenderButtons()
                                    .map(obj => (
                                        <RenderButton
                                            label={obj.label}
                                            gridAreaName={obj.gridAreaName}
                                            disabled={false}
                                            clicked={() => {
                                                console.log(obj.gridAreaName);
                                                this.setState({
                                                    targetButton:
                                                        obj.gridAreaName
                                                });
                                            }}
                                        />
                                    ))
                            ]}
                        />
                    ) : (
                        <span></span>
                    )}
                </div>
                <div className="group-creator__editor">
                    {this.state.targetButton !== null ? (
                        <React.Fragment>
                            <div>
                                <span>Type:</span>
                                <Select
                                    className="w-9 ml-1"
                                    ref={this.typeRef}
                                    options={this.typeOptions.map(option => {
                                        return {
                                            key: option.name,
                                            value: option.name
                                        };
                                    })}
                                />
                            </div>
                            <div className="mt-1">
                                <span>Active during: </span>
                                <Checkbox.Group
                                    ref={this.disabledRef}
                                    options={[
                                        {
                                            label: 'auto',
                                            value: 'autoButtonsDisabled'
                                        },
                                        {
                                            label: 'teleop',
                                            value: 'teleopButtonsDisabled'
                                        },
                                        {
                                            label: 'endgame',
                                            value: 'endgameButtonsDisabled'
                                        }
                                    ]}
                                />
                            </div>
                            <div className="mt-1">
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        console.log(this.typeRef.current);
                                        const selectedOptions = this.disabledRef
                                            .current.state.value;
                                        console.log(selectedOptions);
                                    }}
                                >
                                    Update
                                </Button>
                            </div>
                        </React.Fragment>
                    ) : (
                        <span></span>
                    )}
                </div>
            </div>
        );
    }
}
