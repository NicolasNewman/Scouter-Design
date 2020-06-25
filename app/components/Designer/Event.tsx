import * as React from 'react';
import { Component } from 'react';

import { Table, Select, Checkbox } from 'antd';
import { ColumnProps } from 'antd/es/table';

const { Option } = Select;

interface IProps {}

interface IRowModel {
    name: string;
    type: string;
    accuracy: boolean;
    score: number;
}

// const

const tableData: IRowModel[] = [
    {
        name: 'test1',
        type: 'test1',
        accuracy: true,
        score: 5
    },
    {
        name: 'test2',
        type: 'test2',
        accuracy: true,
        score: 5
    }
];

export default class Event extends Component<IProps> {
    props: IProps;
    tableColModel: ColumnProps<IRowModel>[];

    constructor(props) {
        super(props);
        this.tableColModel = [
            {
                title: 'Name',
                dataIndex: 'name'
            },
            {
                title: 'Type',
                dataIndex: 'type',
                render: (val, record, index) => {
                    console.log('table type:');
                    console.log(val);
                    console.log(record);
                    console.log(index);
                    return (
                        <Select className="w-8">
                            <Option value="robot_event">Robot Event</Option>
                            <Option value="team_event">Team Event</Option>
                            <Option value="foul_event">Foul Event</Option>
                        </Select>
                    );
                }
            },
            {
                title: 'Accuracy',
                dataIndex: 'accuracy',
                render: (val, record, index) => {
                    console.log('table accuracy:');
                    console.log(val);
                    console.log(record);
                    console.log(index);
                    return (
                        <Checkbox
                            onChange={e =>
                                this.accuracyCheckboxChanged(e, record.name)
                            }
                        ></Checkbox>
                    );
                }
            },
            {
                title: 'Score',
                dataIndex: 'score',
                render: (val, record, index) => {
                    return (
                        <span>
                            <Checkbox
                                className="mr-1"
                                onChange={e =>
                                    this.scoreCheckboxChanged(e, record.name)
                                }
                            ></Checkbox>
                            {val}
                        </span>
                    );
                }
            }
        ];
    }

    accuracyCheckboxChanged = (e, name: string) => {
        console.log(name);
        console.log(e.target.checked);
    };

    scoreCheckboxChanged = (e, name: string) => {
        console.log(name);
        console.log(e.target.checked);
    };

    render() {
        return (
            <div>
                <Table
                    pagination={false}
                    columns={this.tableColModel}
                    dataSource={tableData}
                />
            </div>
        );
    }
}
