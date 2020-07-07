import * as React from 'react';
import { Component } from 'react';
import FormGroup from '../../classes/models/FormGroup';
import DraggableGroup from '../DraggableGroup';
import FormGridSlot from '../FormGridSlot';
import { Button, InputNumber } from 'antd';
import Grid from '../Grid/Grid';
import {
    generateGridColString,
    generateGridRowString
} from '../../utils/helper';

interface IProps {
    groups: Array<FormGroup>;
}

interface IState {
    rows: number;
    cols: number;
}

export default class FormCreator extends Component<IProps, IState> {
    props: IProps;

    rowRef: React.RefObject<any>;
    colRef: React.RefObject<any>;

    constructor(props: IProps) {
        super(props);

        this.state = {
            rows: 2,
            cols: 2
        };

        this.rowRef = React.createRef();
        this.colRef = React.createRef();
    }

    generateTemplateArea = () => {
        let templateArea = '';
        let row = '';
        for (let i = 0; i < this.state.rows; i++) {
            row = "'";
            for (let j = 0; j < this.state.cols; j++) {
                row += `r${i}c${j} `;
            }
            row = row.replace(/\s+(?=\S*$)/g, "'\n"); // replace last space
            templateArea += row;
        }
        return templateArea;
    };

    render() {
        return (
            <div className="form-creator">
                <div className="form-creator__builder">
                    {/* <FormGridSlot /> */}
                    <Grid
                        rows={generateGridColString(this.state.rows)}
                        cols={generateGridColString(this.state.cols)}
                        templateArea={this.generateTemplateArea()}
                        className={'form-creator__grid'}
                        gridElements={(() => {
                            const elements = [];
                            for (let i = 0; i < this.state.rows; i++) {
                                for (let j = 0; j < this.state.cols; j++) {
                                    elements.push(
                                        <FormGridSlot
                                            gridAreaName={`r${i}c${j}`}
                                        />
                                    );
                                }
                            }
                            return elements;
                        })()}
                    />
                </div>
                <div className="form-creator__editor">
                    <div className="form-creator__editor--dimensions mt-1">
                        <div>
                            <span>Rows: </span>
                            <InputNumber
                                ref={this.rowRef}
                                min={1}
                                defaultValue={this.state.rows}
                                className="w-3 mr-1"
                            />
                            <span>Cols: </span>
                            <InputNumber
                                ref={this.colRef}
                                min={1}
                                defaultValue={this.state.cols}
                                className="w-3"
                            />
                        </div>
                        <div className="mt-1">
                            <Button
                                type="primary"
                                onClick={() => {
                                    const rows =
                                        this.rowRef.current.state.value + 1;
                                    const cols = this.colRef.current.state
                                        .value;

                                    this.setState({ rows, cols });
                                }}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                    <div className="form-creator__editor--groups">
                        {...this.props.groups.map(group => (
                            <DraggableGroup group={group} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
