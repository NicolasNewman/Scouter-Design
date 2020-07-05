import * as React from 'react';
import { Component } from 'react';
import { EventDataArray, StateDataArray } from 'app/types/types';
import { Button, Select, Modal, Input } from 'antd';
import FormGroup from '../../classes/models/FormGroup';
import { toCamelCase } from '../../utils/helper';

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
}

export default class GroupCreator extends Component<IProps, IState> {
    props: IProps;
    input: React.RefObject<Input>;

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
        this.input = React.createRef();
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
                    <div className="">
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
                            options={this.props.groups.map(group => {
                                return {
                                    key: group.getGridAreaName(),
                                    value: group.getName()
                                };
                            })}
                        />
                    </div>
                    <div className=""></div>
                </div>
                <div className="group-creator__builder">B</div>
                <div className="group-creator__editor">C</div>
            </div>
        );
    }
}
