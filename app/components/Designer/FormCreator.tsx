import * as React from 'react';
import { Component } from 'react';
import FormGroup from '../../classes/models/FormGroup';
import DraggableGroup from '../DraggableGroup';
import FormGridSlot from '../FormGridSlot';
import { Button, InputNumber } from 'antd';
import Grid from '../Grid/Grid';
import {
    generateGridColString,
    generateGridRowString,
    print2DArray
} from '../../utils/helper';

interface IProps {
    groups: Array<FormGroup>;
}

interface IState {
    rows: number;
    cols: number;
    /** The model that contains each letter position for the drop zone grid */
    gridModel: Array<Array<string>>;
    /** The model that contains which zones to merge on the grid */
    joinModel: Array<Array<string>>;
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
            joinModel: new Array(2).fill(new Array(2).fill('')),
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
                gridModel[i].push(String.fromCharCode(65 + counter)); // ASCII: 65 = A
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
                                            isJoiningGrid={
                                                this.state.isJoiningGrid
                                            }
                                            joinModel={
                                                this.state.joinModel[i][j]
                                            }
                                            joinClickHandler={() => {
                                                const cpy = this.state.joinModel.map(
                                                    cols => cols.map(num => num)
                                                );
                                                if (
                                                    this.state.joinModel[i][
                                                        j
                                                    ] ===
                                                    this.state.gridModel[i][j]
                                                ) {
                                                    cpy[i][j] = '';
                                                } else {
                                                    cpy[i][
                                                        j
                                                    ] = this.state.gridModel[i][
                                                        j
                                                    ];
                                                }
                                                console.log(cpy);
                                                this.setState({
                                                    joinModel: cpy
                                                });
                                            }}
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
                                        ),
                                        joinModel: new Array(rows).fill(
                                            new Array(cols).fill('')
                                        )
                                    });
                                }}
                            >
                                Update
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    if (this.state.isJoiningGrid) {
                                        // the user wants to merge the grids
                                        let rMin = Number.MAX_VALUE,
                                            rMax = Number.MIN_VALUE;
                                        let cMin = Number.MAX_VALUE,
                                            cMax = Number.MIN_VALUE;

                                        const m = this.state.joinModel;
                                        print2DArray(m);
                                        for (
                                            let i = 0;
                                            i < this.state.rows;
                                            i++
                                        ) {
                                            for (
                                                let j = 0;
                                                j < this.state.cols;
                                                j++
                                            ) {
                                                const notEmpty = m[i][j] !== '';
                                                if (notEmpty && i < rMin) {
                                                    rMin = i;
                                                }
                                                if (notEmpty && i > rMax) {
                                                    rMax = i;
                                                }
                                                if (notEmpty && j < cMin) {
                                                    cMin = j;
                                                }
                                                if (notEmpty && j > cMax) {
                                                    cMax = j;
                                                }
                                            }
                                        }
                                        console.log(`row: [${rMin},${rMax}]`);
                                        console.log(`col: [${cMin},${cMax}]`);

                                        if (
                                            rMax - rMin + 1 > 0 &&
                                            cMax - cMin + 1 > 0
                                        ) {
                                            const newMatrix = new Array(
                                                rMax - rMin + 1
                                            ).fill(
                                                new Array(cMax - cMin + 1).fill(
                                                    ''
                                                )
                                            );
                                            console.log(newMatrix);
                                            for (let i = rMin; i <= rMax; i++) {
                                                for (
                                                    let j = cMin;
                                                    j <= cMax;
                                                    j++
                                                ) {
                                                    console.log(
                                                        `newMatrix[${i -
                                                            rMin}][${j -
                                                            cMin}] = m[${i}][${j}] = ${
                                                            m[i][j]
                                                        }`
                                                    );
                                                    newMatrix[i - rMin][
                                                        j - cMin
                                                    ] = m[i][j];
                                                }
                                            }
                                            print2DArray(newMatrix);

                                            const emptySlot = newMatrix.includes(
                                                ''
                                            );

                                            this.setState({
                                                joinModel: new Array(
                                                    this.state.rows
                                                ).fill(
                                                    new Array(
                                                        this.state.cols
                                                    ).fill('')
                                                ),
                                                isJoiningGrid: !this.state
                                                    .isJoiningGrid
                                            });
                                        }
                                    } else {
                                        // the user wants to select grids to merge
                                        this.setState({
                                            isJoiningGrid: !this.state
                                                .isJoiningGrid
                                        });
                                    }
                                }}
                            >
                                {this.state.isJoiningGrid ? 'Confirm' : 'Join'}
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
