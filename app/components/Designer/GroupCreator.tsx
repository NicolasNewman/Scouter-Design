import * as React from 'react';
import { Component } from 'react';
import { EventDataArray, StateDataArray } from 'app/types/types';
import { Button, Select, Modal, Input, InputNumber } from 'antd';
import FormGroup from '../../classes/models/FormGroup';
import { toCamelCase } from '../../utils/helper';
import Grid from '../Grid';

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
}

export default class GroupCreator extends Component<IProps, IState> {
    props: IProps;
    input: React.RefObject<Input>;
    rowRef: React.RefObject<any>;
    colRef: React.RefObject<any>;

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            targetGroup: null
        };
        this.input = React.createRef();
        this.rowRef = React.createRef();
        this.colRef = React.createRef();
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
                                    inputValue: `${rowCount}`,
                                    value: rowCount
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
                                min={2}
                                // defaultValue={this.state.targetRows}
                                className="w-3 mr-1"
                            />
                            <span>Cols: </span>
                            <InputNumber
                                ref={this.colRef}
                                min={1}
                                // defaultValue={this.state.targetCols}
                                className="w-3"
                            />
                        </div>
                        <div className="mt-1">
                            <Button
                                onClick={e => {
                                    const rows = this.rowRef.current.state
                                        .value;
                                    const cols = this.colRef.current.state
                                        .value;
                                    this.state.targetGroup.setRowCount(rows);
                                    this.state.targetGroup.setColCount(cols);
                                    console.log(
                                        this.state.targetGroup.toString()
                                    );
                                    console.log(this.input);
                                    console.log(this.colRef);
                                }}
                                type="primary"
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="group-creator__builder">
                    <Grid
                        gridAreaName="state"
                        className="input-grid__child"
                        cols="1fr 1fr"
                        rows="10% 30% 30% 30%"
                        templateArea="
                            'title      title   '
                            'gather     shooting'
                            'wheel      climbing'
                            'defending  defended'"
                        gridElements={[
                            <div className="input-grid__title">
                                <p>States</p>
                            </div>
                        ]}
                    />
                    ,
                </div>
                <div className="group-creator__editor">C</div>
            </div>
        );
    }
}
