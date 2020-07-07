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
    gridModel: Array<Array<string>>;
    isJoiningGrid: boolean;
}

export default class FormCreator extends Component<IProps, IState> {
    props: IProps;

    rowRef: React.RefObject<any>;
    colRef: React.RefObject<any>;

    constructor(props: IProps) {
        super(props);

        this.state = {
            rows: 2,
            cols: 2,
            gridModel: this.generateGridModel(2, 2),
            isJoiningGrid: false
        };

        this.rowRef = React.createRef();
        this.colRef = React.createRef();
    }

    generateGridModel = (row: number, col: number) => {
        const gridModel: Array<Array<string>> = [];
        let counter = 0;
        for (let i = 0; i < row; i++) {
            gridModel.push([]);
            for (let j = 0; j < col; j++) {
                gridModel[i].push(String.fromCharCode(65 + counter));
                counter++;
            }
        }
        return gridModel;
    };

    generateTemplateArea = () => {
        let templateArea = '';
        let row = '';
        for (let i = 0; i < this.state.rows; i++) {
            row = "'";
            for (let j = 0; j < this.state.cols; j++) {
                row += `${this.state.gridModel[i][j]} `;
            }
            row = row.replace(/\s+(?=\S*$)/g, "'\n"); // replace last space
            templateArea += row;
        }
        return templateArea;
    };

    render() {
        console.log(this.state);
        console.log(this.generateTemplateArea());
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
                                            gridAreaName={`${this.state.gridModel[i][j]}`}
                                            row={this.state.rows}
                                            col={this.state.cols}
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
                        <div className="my-1">
                            <Button
                                type="primary"
                                className="mr-1"
                                onClick={() => {
                                    const rows = this.rowRef.current.state
                                        .value;
                                    const cols = this.colRef.current.state
                                        .value;

                                    this.setState({
                                        rows,
                                        cols,
                                        gridModel: this.generateGridModel(
                                            rows,
                                            cols
                                        )
                                    });
                                }}
                            >
                                Update
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.setState({
                                        isJoiningGrid: !this.state.isJoiningGrid
                                    });
                                }}
                            >
                                Join
                            </Button>
                        </div>
                    </div>
                    <div className="form-creator__editor--groups">
                        {...this.props.groups.map(group => (
                            <DraggableGroup
                                disabled={true}
                                group={group}
                                canDrag={!this.state.isJoiningGrid}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
