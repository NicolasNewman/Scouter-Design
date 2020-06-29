import * as React from 'react';
import { Component, useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import { Select, Checkbox, Button, Modal, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { FormInstance } from 'antd/lib/form';
import { StateDataArray, StateData } from '../../types/types';
import { formatStateName } from '../../utils/helper';

const { Option } = Select;

/**
 * Interface that defines the data needed for a single row in the table
 */
interface Item {
    key: string;
    name: string;
    editable?: boolean;
    inputType?: 'number' | 'text';
    dataIndex?: string;
    title?: string;
    editing?: (record: Item) => boolean;
}

const originData: Item[] = [
    {
        key: '0',
        name: 'a'
    }
];

interface IProps {
    states: StateDataArray;
    addStateItem: (state: StateData) => void;
    removeStateItem: (state: StateData) => void;
    updateStateItem: (name: string, newData: StateData) => void;
    overwriteStateItem: (states: StateDataArray) => void;
}

interface IState {
    data: Item[];
    editingKey: string;
    modalVisible: boolean;
}

/**
 * Component for the custom table
 */
export default class StateTable extends Component<IProps, IState> {
    props: IProps;
    state: IState;
    form: React.RefObject<FormInstance>;
    input: React.RefObject<Input>;
    cols: ColumnProps<Item>[];
    backup: Item[];

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.states.map((state, i) => {
                return {
                    key: i.toString(),
                    name: state.name
                } as Item;
            }),
            editingKey: '',
            modalVisible: false
        };
        this.form = React.createRef();
        this.input = React.createRef();
        this.cols = [
            {
                title: 'name',
                dataIndex: 'name'
            },
            {
                title: 'operation',
                dataIndex: 'operation',
                render: (_: any, record: Item) => {
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
                            <a
                                onClick={() => this.save(record.key)}
                                style={{ marginRight: 8 }}
                            >
                                Save
                            </a>
                            <Popconfirm
                                title="Sure to cancel?"
                                onConfirm={this.cancel}
                            >
                                <a style={{ marginRight: 8 }}>Cancel</a>
                            </Popconfirm>
                            <Popconfirm
                                title="Sure to delete?"
                                onConfirm={() => this.delete(record)}
                            >
                                <a>Delete</a>
                            </Popconfirm>
                        </span>
                    ) : (
                        <a
                            hidden={this.state.editingKey !== ''}
                            onClick={() => this.edit(record)}
                        >
                            Edit
                        </a>
                    );
                }
            }
        ];
    }

    showNameError = (name: string) => {
        message.error({
            content: `"${name}" is not a valid event name. An event name can only contain alphanumeric characters and "_"`,
            style: {
                marginTop: '2.5%'
            },
            duration: 5
        });
    };

    isEditing = (record: Item) => {
        return record.key === this.state.editingKey;
    };

    edit = (record: Item) => {
        this.backup = [...this.state.data];
        this.setState({ editingKey: record.key });
    };

    cancel = () => {
        this.setState({ editingKey: '', data: this.backup });
    };

    delete = (record: Item) => {
        let copy = [...this.state.data];
        copy = copy.filter(item => item.key !== record.key);

        const toDelete = this.state.data.find(
            item => item.name === record.name
        );
        this.props.removeStateItem(this.itemToStateData(toDelete));

        this.setState({ data: copy, editingKey: '' });
    };

    save = async (key: React.Key) => {
        const index = this.state.data.findIndex(item => key === item.key);
        const item = this.state.data[index];

        this.props.updateStateItem(item.name, this.itemToStateData(item));
        this.setState({ editingKey: '' });
    };

    /**
     * Adds a new row to the table
     */
    add = () => {
        const name = formatStateName(this.input.current.state.value);
        if (!this.isAllowedName(name)) {
            this.showNameError(name);
        } else {
            const newRow: Item = {
                key: this.getNextKey(),
                name
            };
            this.props.addStateItem(this.itemToStateData(newRow));
            this.setState({
                data: [...this.state.data, newRow],
                modalVisible: false
            });
        }
    };

    /**
     * Determines what the next key should be from the Item[] in state.data
     */
    getNextKey = () => {
        if (this.state.data.length === 0) return '0';

        const keys = this.state.data
            .map(obj => parseInt(obj.key)) // extract keys from Item[]
            .filter(x => !isNaN(x)) // filter out falsey values from parseInt failing
            .sort((a, b) => a - b); // re-arrange by ascending order

        const n = keys.length;
        for (let i = 0; i < n - 1; i++) {
            // determine if there is a gap in the sequence
            if (keys[i + 1] - keys[i] > 1) {
                return `${keys[i] + 1}`;
            }
        }
        return `${keys[n - 1] + 1}`;
    };

    /**
     * Verifies if the passed name is a valid state name
     *
     * A valid name contains no digits, spaces, or special characters (with the exception of "_")
     *
     * A valid name must also begin with STATE_
     * @param name - the name to verify
     */
    isAllowedName = (name: string): boolean => {
        const usedNames = this.state.data.map(item => item.name); // extract the names in use from the data obj
        const c1 = usedNames.includes(name); // check if the name is already in use
        const c2 = /[!-@]|[[-^]|[`-~]/.test(name); // make sure lowercase, digit, and gramerical characters are not in the string (regex that utilises ASCII table ordering)
        const c3 = !name.startsWith('STATE_');
        return !(c1 || c2 || c3);
    };

    /**
     * Converts a Item object (used by the table) to a StateData object (used by the redux state manager)
     * @param item - the item to convert
     */
    itemToStateData = (item: Item): StateData => {
        return {
            name: item.name
        };
    };

    render() {
        return (
            <div>
                <Modal
                    title="State name?"
                    visible={this.state.modalVisible}
                    onOk={this.add}
                    onCancel={() => this.setState({ modalVisible: false })}
                >
                    <Input
                        addonBefore="STATE_"
                        placeholder="State name"
                        ref={this.input}
                    ></Input>
                </Modal>
                <Form ref={this.form}>
                    <Button
                        className="mb-1 ml-1"
                        onClick={() => this.setState({ modalVisible: true })}
                        type="primary"
                    >
                        Add State
                    </Button>
                    <Table
                        bordered
                        dataSource={this.state.data}
                        columns={this.cols}
                        rowClassName="editable-row"
                        pagination={false}
                        scroll={{ y: 325 }}
                    />
                </Form>
            </div>
        );
    }
}
