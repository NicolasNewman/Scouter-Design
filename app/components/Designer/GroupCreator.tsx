import * as React from 'react';
import { Component } from 'react';
import { EventDataArray, StateDataArray } from 'app/types/types';
import { Button, Select } from 'antd';
import FormGroup from '../../classes/models/FormGroup';

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
                        <Button className="mr-1" type="primary">
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
