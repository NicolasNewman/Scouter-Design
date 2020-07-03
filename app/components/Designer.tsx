import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Tabs } from 'antd';
import DataStore from 'app/classes/DataStore';

import Event from './Designer/Event';
import EventTable from './Table/EventTable';
import StateTable from './Table/StateTable';

import {
    EventData,
    EventDataArray,
    StateData,
    StateDataArray,
    FileMode
} from '../types/types';

import WorkspaceParser from '../classes/WorkspaceParser';
import IpcInterface from '../classes/IpcInterface';

const { TabPane } = Tabs;

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;

    // redux - core
    file: string;
    mode: FileMode;

    // redux - event
    events: EventDataArray;
    addEventItem: (event: EventData) => void;
    removeEventItem: (event: EventData) => void;
    updateEventItem: (name: string, newData: EventData) => void;
    overwriteEventItem: (events: EventDataArray) => void;

    // redux - state
    states: StateDataArray;
    addStateItem: (state: StateData) => void;
    removeStateItem: (state: StateData) => void;
    updateStateItem: (name: string, newData: StateData) => void;
    overwriteStateItem: (states: StateDataArray) => void;
}

export default class Home extends Component<IProps> {
    props: IProps;
    parser: WorkspaceParser;
    ipcInterface: IpcInterface;

    constructor(props) {
        super(props);
        console.log(props);
        this.parser = new WorkspaceParser(this.props.file, this.props.mode);
        this.ipcInterface = new IpcInterface(this.parser);
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
                        <EventTable
                            events={this.props.events}
                            addEventItem={this.props.addEventItem}
                            removeEventItem={this.props.removeEventItem}
                            updateEventItem={this.props.updateEventItem}
                            overwriteEventItem={this.props.overwriteEventItem}
                        />
                    </TabPane>
                    <TabPane tab="States" key="states">
                        <StateTable
                            states={this.props.states}
                            addStateItem={this.props.addStateItem}
                            removeStateItem={this.props.removeStateItem}
                            updateStateItem={this.props.updateStateItem}
                            overwriteStateItem={this.props.overwriteStateItem}
                        />
                    </TabPane>
                    <TabPane tab="Form" key="form">
                        <p>Form Tab</p>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
