import * as React from 'react';
import { Component, useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import { Select, Checkbox, Button, Modal } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { FormInstance } from 'antd/lib/form';
import { EventType } from '../../types/types';

const { Option } = Select;

/**
 * Interface that defines the data needed for a single row in the table
 */
interface Item {
    key: string;
    name: string;
    type: EventType;
    accuracy: boolean;
    score: number;
    editable?: boolean;
    inputType?: 'number' | 'text';
    dataIndex?: string;
    title?: string;
    editing?: (record: Item) => boolean;
}

const originData: Item[] = [
    {
        key: '0',
        name: 'a',
        type: 'robot_event',
        accuracy: true,
        score: 5
    }
];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}

/**
 * Functional component for a table cell that is editable
 */
const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    // If the editing flag is true, display a text field
    // Else, show the cell's contents
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`
                        }
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

interface IProps {}

interface IState {
    data: Item[];
    editingKey: string;
    modalVisible: boolean;
}

/**
 * Component for the custom table
 */
export default class EventTable extends Component<IProps, IState> {
    props: IProps;
    state: IState;
    form: React.RefObject<FormInstance>;
    input: React.RefObject<Input>;
    cols: ColumnProps<Item>[];

    constructor(props) {
        super(props);
        this.state = {
            data: originData,
            editingKey: '',
            modalVisible: false
        };
        this.form = React.createRef();
        this.input = React.createRef();
        this.cols = [
            {
                title: 'name',
                dataIndex: 'name',
                editable: true
            },
            {
                title: 'type',
                dataIndex: 'type',
                render: (val, record: Item, index) => {
                    return (
                        <Select
                            className="w-8"
                            onChange={(val: EventType) => {
                                const cpy = this.state.data.map(obj => ({
                                    ...obj
                                }));
                                cpy[index].type = val;
                                this.setState({ data: cpy });
                            }}
                            defaultValue={record.type}
                        >
                            <Option value="robot_event">Robot Event</Option>
                            <Option value="team_event">Team Event</Option>
                            <Option value="foul_event">Foul Event</Option>
                        </Select>
                    );
                }
            },
            {
                title: 'accuracy',
                dataIndex: 'accuracy',
                render: (val, record: Item, index) => {
                    return (
                        <Checkbox
                            defaultChecked={record.accuracy}
                            onChange={event => {
                                const cpy = this.state.data.map(obj => ({
                                    ...obj
                                }));
                                cpy[index].accuracy = event.target.checked;
                                this.setState({ data: cpy });
                            }}
                        ></Checkbox>
                    );
                    this.setState({ modalVisible: false });
                }
            },
            {
                title: 'score',
                dataIndex: 'score',
                editable: true
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
        ].map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record: Item) => ({
                    record,
                    inputType: col.dataIndex === 'score' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record)
                })
            };
        });
    }

    isEditing = (record: Item) => {
        return record.key === this.state.editingKey;
    };

    edit = (record: Item) => {
        this.form.current.setFieldsValue({
            name: '',
            type: '',
            accuracy: false,
            score: 0,
            ...record
        });
        this.setState({ editingKey: record.key });
    };

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    delete = (record: Item) => {
        let copy = [...this.state.data];
        copy = copy.filter(item => item.key !== record.key);
        this.setState({ data: copy, editingKey: '' });
    };

    save = async (key: React.Key) => {
        try {
            const row = (await this.form.current.validateFields()) as Item;

            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row
                });
                this.setState({
                    data: newData,
                    editingKey: ''
                });
            } else {
                newData.push(row);
                this.setState({
                    data: newData,
                    editingKey: ''
                });
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    /**
     * Adds a new row to the table
     */
    add = () => {
        console.log('a');

        const newRow: Item = {
            key: this.getNextKey(),
            accuracy: false,
            type: 'robot_event',
            score: 0,
            name: this.input.current.state.value
        };
        console.log('b');

        this.setState({
            data: [...this.state.data, newRow],
            modalVisible: false
        });
        console.log('c');
    };

    /**
     * Determines what the next key should be from the Item[] in state.data
     */
    getNextKey = () => {
        console.log('Getting next key:');
        console.log(this.state.data);
        const keys = this.state.data
            .map(obj => parseInt(obj.key)) // extract keys from Item[]
            .filter(x => !isNaN(x)) // filter out falsey values from parseInt failing
            .sort((a, b) => a - b); // re-arrange by ascending order

        const n = keys.length;
        for (let i = 0; i < n - 1; i++) {
            if (keys[i + 1] - keys[i] > 1) {
                // determine if there is a gap in the sequence
                return `${keys[i] + 1}`;
            }
        }
        return `${keys[n - 1] + 1}`;
    };

    render() {
        return (
            <div>
                <Modal
                    title="Event name?"
                    visible={this.state.modalVisible}
                    onOk={this.add}
                    onCancel={() => this.setState({ modalVisible: false })}
                >
                    <Input
                        addonBefore="EVENT_"
                        placeholder="Event name"
                        ref={this.input}
                    ></Input>
                </Modal>
                <Form ref={this.form}>
                    <Button
                        className="mb-1 ml-1"
                        onClick={() => this.setState({ modalVisible: true })}
                        type="primary"
                    >
                        Add Event
                    </Button>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell
                            }
                        }}
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
