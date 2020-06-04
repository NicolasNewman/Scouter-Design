import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Tabs } from 'antd';
import DataStore from 'app/classes/DataStore';

import Event from './Designer/Event';

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
                    <TabPane
                        tab="General"
                        key="general"
                        disabled={!this.props.core_status}
                    >
                        <Event />
                    </TabPane>
                    <TabPane
                        tab="Events"
                        key="events"
                        disabled={!this.props.core_status}
                    >
                        <p>Event Tab</p>
                    </TabPane>
                    <TabPane
                        tab="States"
                        key="states"
                        disabled={!this.props.core_status}
                    >
                        <p>State Tab</p>
                    </TabPane>
                    <TabPane
                        tab="Form"
                        key="form"
                        disabled={!this.props.core_status}
                    >
                        <p>Form Tab</p>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
