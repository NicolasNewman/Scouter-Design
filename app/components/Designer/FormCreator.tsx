import * as React from 'react';
import { Component } from 'react';
import FormGroup from '../../classes/models/FormGroup';
import DraggableGroup from '../DraggableGroup';
import FormGridSlot from '../FormGridSlot';

interface IProps {
    groups: Array<FormGroup>;
}

interface IState {}

export default class FormCreator extends Component<IProps, IState> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
    }
    render() {
        return (
            <div className="form-creator">
                <div className="form-creator__builder">
                    <FormGridSlot />
                </div>
                <div className="form-creator__editor">
                    <div>Stuff</div>
                    <div>
                        {...this.props.groups.map(group => (
                            <DraggableGroup group={group} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
