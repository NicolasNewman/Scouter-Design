import * as React from 'react';
import { Component } from 'react';

import { Table, Select } from 'antd';
import { ColumnProps } from 'antd/es/table';

const { Option } = Select;

interface IProps {}

interface IRowModel {
    name: string;
    type: string;
}

const tableColModel: ColumnProps<IRowModel>[] = [
    {
        title: 'Name',
        dataIndex: 'name'
    },
    {
        title: 'Type',
        dataIndex: 'type',
        render: (text, record, index) => {
            console.log('table type:');
            console.log(text);
            console.log(record);
            console.log(index);
            return (
                <Select>
                    <Option value="robot_event">Robot Event</Option>
                    <Option value="team_event">Team Event</Option>
                    <Option value="foul_event">Foul Event</Option>
                </Select>
            );
        }
    }
];

const tableData: IRowModel[] = [
    {
        name: 'test1',
        type: 'test1'
    },
    {
        name: 'test2',
        type: 'test2'
    }
];

export default class Event extends Component<IProps> {
    props: IProps;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Table columns={tableColModel} dataSource={tableData} />
            </div>
        );
    }
}
