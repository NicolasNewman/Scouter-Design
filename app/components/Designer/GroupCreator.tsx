import * as React from 'react';
import { Component } from 'react';
import { EventDataArray, StateDataArray } from 'app/types/types';
import { Button, Select } from 'antd';

interface IProps {
    events: EventDataArray;
    states: StateDataArray;
}

interface IState {}

export default class GroupCreator extends Component<IProps, IState> {
    props: IProps;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="group-creator">
                <div className="group-creator__groups">
                    <div className="">
                        <Button className="w-5 mr-1" type="primary">
                            Add
                        </Button>
                        <Button className="w-5" type="primary" danger>
                            Delete
                        </Button>
                    </div>
                    <div className=""></div>
                </div>
                <div className="group-creator__builder">B</div>
                <div className="group-creator__editor">C</div>
            </div>
        );
    }
}
