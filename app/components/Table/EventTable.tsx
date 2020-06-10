import * as React from 'react';
import { Component, useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import { Select, Checkbox } from 'antd';
// import { Table, Select, Checkbox } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { FormInstance } from 'antd/lib/form';
import { EventType } from '../../types/types';

const { Option } = Select;

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
        key: 'a',
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
}
export default class EventTable extends Component<IProps, IState> {
    props: IProps;
    state: IState;
    form: React.RefObject<FormInstance>;
    cols: ColumnProps<Item>[];

    constructor(props) {
        super(props);
        this.state = {
            data: originData,
            editingKey: ''
        };
        this.form = React.createRef();
        this.cols = [
            {
                title: 'name',
                dataIndex: 'name',
                // width: '25%',
                editable: true
            },
            {
                title: 'type',
                dataIndex: 'type',
                // width: '25%',
                // editable: true,
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
                // width: '25%',
                // editable: true,
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
                }
            },
            {
                title: 'score',
                dataIndex: 'score',
                // width: '25%',
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
                                href="javascript:;"
                                onClick={() => this.save(record.key)}
                                style={{ marginRight: 8 }}
                            >
                                Save
                            </a>
                            <Popconfirm
                                title="Sure to cancel?"
                                onConfirm={this.cancel}
                            >
                                <a>Cancel</a>
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

    render() {
        return (
            <Form ref={this.form}>
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
                    pagination={{
                        onChange: this.cancel
                    }}
                />
            </Form>
        );
    }
}

// export default class Event extends Component<IProps> {
//     props: IProps;
//     tableColModel: ColumnProps<IRowModel>[];

//     constructor(props) {
//         super(props);
//         this.tableColModel = [
//             {
//                 title: 'Name',
//                 dataIndex: 'name'
//             },
//             {
//                 title: 'Type',
//                 dataIndex: 'type',
//                 render: (val, record, index) => {
//                     console.log('table type:');
//                     console.log(val);
//                     console.log(record);
//                     console.log(index);
//                     return (
//                         <Select className="w-8">
//                             <Option value="robot_event">Robot Event</Option>
//                             <Option value="team_event">Team Event</Option>
//                             <Option value="foul_event">Foul Event</Option>
//                         </Select>
//                     );
//                 }
//             },
//             {
//                 title: 'Accuracy',
//                 dataIndex: 'accuracy',
//                 render: (val, record, index) => {
//                     console.log('table accuracy:');
//                     console.log(val);
//                     console.log(record);
//                     console.log(index);
//                     return (
//                         <Checkbox
//                             onChange={e =>
//                                 this.accuracyCheckboxChanged(e, record.name)
//                             }
//                         ></Checkbox>
//                     );
//                 }
//             },
//             {
//                 title: 'Score',
//                 dataIndex: 'score',
//                 render: (val, record, index) => {
//                     return (
//                         <span>
//                             <Checkbox
//                                 className="mr-1"
//                                 onChange={e =>
//                                     this.scoreCheckboxChanged(e, record.name)
//                                 }
//                             ></Checkbox>
//                             {val}
//                         </span>
//                     );
//                 }
//             }
//         ];
//     }

//     accuracyCheckboxChanged = (e, name: string) => {
//         console.log(name);
//         console.log(e.target.checked);
//     };

//     scoreCheckboxChanged = (e, name: string) => {
//         console.log(name);
//         console.log(e.target.checked);
//     };

//     render() {
//         return (
//             <div>
//                 <Table
//                     pagination={false}
//                     columns={this.tableColModel}
//                     dataSource={tableData}
//                 />
//             </div>
//         );
//     }
// }
