import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Tabs } from 'antd';
import DataStore from 'app/classes/DataStore';

const { TabPane } = Tabs;

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
    core_status: boolean;
}

export default class Home extends Component<IProps> {
    props: IProps;

    constructor(props) {
        super(props);
    }

    tabChanged = key => {
        console.log(key);
    };

    render() {
        return (
            <div className="home">
                <Tabs defaultActiveKey="general" onChange={this.tabChanged}>
                    <TabPane tab="General" key="general">
                        <p>General Tab</p>
                    </TabPane>
                    <TabPane tab="Events" key="events">
                        <p>Event Tab</p>
                    </TabPane>
                    <TabPane tab="States" key="states">
                        <p>State Tab</p>
                    </TabPane>
                    <TabPane tab="Form" key="form">
                        <p>Form Tab</p>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
