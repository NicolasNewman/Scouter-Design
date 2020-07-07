import * as React from 'react';
import { Component } from 'react';
import { EventDataArray, StateDataArray } from 'app/types/types';
import { Button, Select, Modal, Input, InputNumber, Checkbox } from 'antd';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import FormGroup from '../../classes/models/FormGroup';
import FormButton from '../../classes/models/FormButton';
import { toCamelCase, andBoolStrings, isEventData } from '../../utils/helper';
import Grid from '../Grid/Grid';
import RenderButton from '../Grid/RenderButton';
import { EventData, StateData, ButtonType } from '../../types/types';
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
    typeVal: string;
}

export default class GroupCreator extends Component<IProps, IState> {
    props: IProps;
    /** list containing all of the events and states the user has defined */
    typeOptions: Array<EventData | StateData>;

    /** reference to the modal input for creating a new group */
    input: React.RefObject<Input>;
    /** reference to the input for a group button's label */
    labelRef: React.RefObject<Input>;

    rowRef: React.RefObject<any>;
    colRef: React.RefObject<any>;

    disabledRef: React.RefObject<CheckboxGroup>;

    constructor(props) {
        super(props);
        console.log(this.props.groups);
        this.state = {
            modalVisible: false,
            targetGroup: null,
            targetButton: null,
            typeVal: ''
        };
        this.typeOptions = [];

        this.input = React.createRef();
        this.labelRef = React.createRef();

        this.rowRef = React.createRef();
        this.colRef = React.createRef();

        this.disabledRef = React.createRef();
    }

    componentDidMount() {
        // regenerate the type list in the event that it changed
        this.typeOptions = [];
        this.props.events.forEach(event => {
            this.typeOptions.push(event);
        });
        this.props.states.forEach(state => {
            this.typeOptions.push(state);
        });
    }

    shouldComponentUpdate(nextProps: IProps) {
        // makes sure the component re-renders if the events or states change
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
                                // handle the add group button being pressed
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
                                // subtract 1 b/c the group header is included
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
                                // Function to handle updating a group's data
                                onClick={e => {
                                    // add 1 to include the group header
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
                                // generate each button to display in the group preview
                                ...this.state.targetGroup
                                    .getRenderButtons()
                                    .map(obj => (
                                        <RenderButton
                                            label={obj.label}
                                            gridAreaName={obj.gridAreaName}
                                            disabled={false}
                                            accuracy={
                                                obj.accuracy
                                                    ? obj.accuracy
                                                    : false
                                            }
                                            clicked={() => {
                                                // handle a group's preview button being pressed
                                                this.setState({
                                                    targetButton:
                                                        obj.gridAreaName
                                                });

                                                // restore the values if a slot has already been modified
                                                if (this.labelRef.current) {
                                                    this.labelRef.current.setState(
                                                        { value: obj.label }
                                                    );
                                                }
                                                if (obj.checkbox) {
                                                    this.disabledRef.current.setState(
                                                        { value: obj.checkbox }
                                                    );
                                                } else if (
                                                    this.disabledRef.current
                                                ) {
                                                    this.disabledRef.current.setState(
                                                        { value: [] }
                                                    );
                                                }
                                                if (obj.type) {
                                                    this.setState({
                                                        typeVal: obj.type
                                                    });
                                                }
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
                                    onChange={val => {
                                        this.setState({
                                            typeVal: val.toString()
                                        });
                                    }}
                                    options={this.typeOptions.map(option => {
                                        return {
                                            key: option.name,
                                            value: option.name
                                        };
                                    })}
                                    value={this.state.typeVal}
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
                                <span>Label: </span>
                                <Input ref={this.labelRef} />
                            </div>
                            <div className="mt-1">
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        // internally update or create a FormButton based on the given data

                                        // get the EventData or StateData equivilent from the type label
                                        const typeMatch = this.typeOptions.find(
                                            type =>
                                                type.name === this.state.typeVal
                                        );

                                        // determine the type of button that should be generated for Scouter
                                        let btnType: ButtonType = 'state';
                                        if (isEventData(typeMatch)) {
                                            if (typeMatch.accuracy) {
                                                btnType = 'accuracy';
                                            } else {
                                                btnType = 'event';
                                            }
                                        }

                                        // determine the correct type that the event / state should belong to (types come from Scouter/global)
                                        let type = '';
                                        if (isEventData(typeMatch)) {
                                            if (
                                                typeMatch.type === 'robot_event'
                                            ) {
                                                if (typeMatch.score > 0) {
                                                    type = `EScorableRobotEvents.${this.state.typeVal}`;
                                                } else {
                                                    type = `ERobotEvents.${this.state.typeVal}`;
                                                }
                                            } else if (
                                                typeMatch.type === 'team_event'
                                            ) {
                                                if (typeMatch.score > 0) {
                                                    type = `EScorableTeamEvents.${this.state.typeVal}`;
                                                } else {
                                                    type = `ETeamEvents.${this.state.typeVal}`;
                                                }
                                            } else {
                                                type = `EFoulEvents.${this.state.typeVal}`;
                                            }
                                        }

                                        // create a new button with the found information
                                        const btn = new FormButton({
                                            gridAreaName: this.state
                                                .targetButton,
                                            label: this.labelRef.current.state
                                                .value,
                                            disabled: andBoolStrings(
                                                this.disabledRef.current.state.value.map(
                                                    value => value.toString()
                                                )
                                            ),
                                            buttonType: btnType,
                                            type
                                        });

                                        this.state.targetGroup.insertButton(
                                            btn
                                        );

                                        // update the corresponding render button so the data can be recovered after selecting a new button
                                        this.state.targetGroup.updateRenderButton(
                                            this.state.targetButton,
                                            this.labelRef.current.state.value,
                                            this.disabledRef.current.state
                                                .value,
                                            this.state.typeVal,
                                            btnType === 'accuracy'
                                                ? true
                                                : false
                                        );

                                        this.props.updateGroup(
                                            this.state.targetGroup.getGridAreaName(),
                                            this.state.targetGroup
                                        );

                                        console.log(btn.getJSX());
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
