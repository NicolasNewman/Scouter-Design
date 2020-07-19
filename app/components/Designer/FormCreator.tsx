import * as React from 'react';
import { Component } from 'react';
import FormGroup from '../../classes/models/FormGroup';
import DraggableGroup from '../DraggableGroup';
import FormGridSlot from '../FormGridSlot';
import { Button, InputNumber, message } from 'antd';
import Grid from '../Grid/Grid';
import { FormLayoutType } from '../../types/types';
import {
    generateGridColString,
    generateGridRowString,
    print2DArray,
    generate2DArray,
    toCamelCase,
    includes2d
} from '../../utils/helper';
import * as deepEquals from 'fast-deep-equal';

interface IProps {
    // redux - group
    groups: Array<FormGroup>;

    // redux - form
    formLayout: FormLayoutType;
    setFormJSXFunc: (func: () => string) => void;
    updateGroup: (key: string, newGroup: FormGroup) => void;
    updateFormLayout: (options: Partial<FormLayoutType>) => void;
}

interface IState {
    /** The model that contains each letter position for the drop zone grid */
    // gridModel: Array<Array<string>>;
    /** The model that contains which zones to merge on the grid (tracks which slots the user has selected) */
    joinModel: Array<Array<string>>;
    /** flag that tracks if the grid is being joined */
    isJoiningGrid: boolean;
    /** a list of the groups that have been dragged onto the grid */
    // groupList: Array<FormGroup>;
}

export default class FormCreator extends Component<IProps, IState> {
    props: IProps;

    /** reference to the row number field */
    rowRef: React.RefObject<any>;
    /** reference to the col number field */
    colRef: React.RefObject<any>;

    constructor(props: IProps) {
        super(props);

        this.state = {
            // gridModel: this.props.formLayout.gridModel,
            joinModel: new Array(this.props.formLayout.rows).fill(new Array(this.props.formLayout.cols).fill('')),
            isJoiningGrid: false
            // groupList: this.props.formLayout.groupList
        };

        this.rowRef = React.createRef();
        this.colRef = React.createRef();

        // create the function that generates the code for the form
        this.props.setFormJSXFunc(
            () => `
            <Grid
                rows="${generateGridColString(this.props.formLayout.rows)}"
                cols="${generateGridColString(this.props.formLayout.cols)}"
                templateArea="${this.generateTemplateArea()}"
                className="form-creator__grid"
                gridElements={[${(() => {
                    const joined = this.props.groups
                        .map(group => (group.getGridAreaName() !== '' ? group.getJSX() : ''))
                        .join(',');
                    return joined;
                })()}]}
            />`
        );
    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        // If the groupList has been changed within the component, update the internal state
        // if (!deepEquals(this.props.formLayout.groupList, this.state.groupList)) {
        //     this.props.overwriteFormGroup(this.state.groupList);
        // }
        // If a dimensional property has been changed within the component, update the internal state
        // if (
        //     this.props.formLayout.rows !== this.state.rows ||
        //     this.props.formLayout.cols !== this.state.cols ||
        //     this.props.formLayout.gridModel !== this.state.gridModel
        // ) {
        //     this.props.setFormDimensions(this.state.rows, this.state.cols, this.state.gridModel);
        // }
        // If the render buttons in redux changed, update to reflect their changes in the FormCreator
        // const prevRenderButtons = prevProps.formLayout.groupList.map(group => group.getRenderButtons());
        // const currentRenderButtons = this.props.formLayout.groupList.map(group => group.getRenderButtons());
        // if (!deepEquals(prevRenderButtons, currentRenderButtons)) {
        //     this.setState({ groupList: this.props.formLayout.groupList });
        // }
    }

    /**
     * Generates a 2d string array containing the letters of the alphabet from A until it runs out of space
     * @param row
     * @param col
     */
    generateGridModel = (row: number, col: number) => {
        const gridModel: string[][] = [];
        let counter = 0;
        let duplicator = 0;
        for (let i = 0; i < row; i++) {
            gridModel.push([]);
            for (let j = 0; j < col; j++) {
                if (counter > 25) {
                    counter = 0;
                    duplicator++;
                }
                let name = '';
                for (let i = 0; i <= duplicator; i++) {
                    name += String.fromCharCode(65 + counter);
                }
                gridModel[i].push(name); // ASCII: 65 = A
                counter++;
            }
        }
        return gridModel;
    };

    /**
     * Generates the gridTemplateArea string from the gridModel
     */
    generateTemplateArea = () => {
        let templateArea = '';
        let row = '';
        for (let i = 0; i < this.props.formLayout.rows; i++) {
            row = "'";
            for (let j = 0; j < this.props.formLayout.cols; j++) {
                row += `${this.props.formLayout.gridModel[i][j]} `;
            }
            row = row.replace(/\s+(?=\S*$)/g, "'\n"); // replace last space
            templateArea += row;
        }
        return templateArea;
    };

    render() {
        console.log(this.state);
        return (
            <div className="form-creator">
                <div className="form-creator__builder">
                    <Grid
                        rows={generateGridColString(this.props.formLayout.rows)}
                        cols={generateGridColString(this.props.formLayout.cols)}
                        templateArea={this.generateTemplateArea()}
                        className={'form-creator__grid'}
                        // generate each slot on the grid that can have a group dragged to
                        gridElements={(() => {
                            const elements = [];
                            // prevents groupToDisplay from doubling up on a group
                            const usedLetters = [];
                            for (let i = 0; i < this.props.formLayout.rows; i++) {
                                for (let j = 0; j < this.props.formLayout.cols; j++) {
                                    // check if a group already exists for that slot (ie its been loaded from the save file)
                                    const groupToDisplay = this.props.groups.filter(group => {
                                        if (
                                            !usedLetters.includes(group.getGridAreaName()) &&
                                            group.getGridAreaName() === this.props.formLayout.gridModel[i][j]
                                        ) {
                                            usedLetters.push(group.getGridAreaName());
                                            return true;
                                        }
                                        return false;
                                    });
                                    console.log(groupToDisplay);
                                    elements.push(
                                        <FormGridSlot
                                            gridAreaName={`${this.props.formLayout.gridModel[i][j]}`}
                                            row={this.props.formLayout.rows}
                                            col={this.props.formLayout.cols}
                                            isJoiningGrid={this.state.isJoiningGrid}
                                            joinModel={this.state.joinModel[i][j]}
                                            inner={groupToDisplay[0] ? groupToDisplay[0] : null}
                                            // visually change the grid slot based on if it was clicked or not
                                            joinClickHandler={() => {
                                                const cpy = this.state.joinModel.map(cols => cols.map(num => num));
                                                if (
                                                    this.state.joinModel[i][j] === this.props.formLayout.gridModel[i][j]
                                                ) {
                                                    // reset back to being unclicked
                                                    cpy[i][j] = '';
                                                } else {
                                                    // set to being clicked
                                                    cpy[i][j] = this.props.formLayout.gridModel[i][j];
                                                }
                                                this.setState({
                                                    joinModel: cpy
                                                });
                                            }}
                                            updateGroup={this.props.updateGroup}
                                            removeGroupList={(group: FormGroup) => {
                                                group.setGridAreaName(toCamelCase(group.getName()));
                                                this.props.updateGroup(group.getName(), group);
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
                                defaultValue={this.props.formLayout.rows}
                                className="w-3 mr-1"
                            />
                            <span>Cols: </span>
                            <InputNumber
                                ref={this.colRef}
                                min={1}
                                defaultValue={this.props.formLayout.cols}
                                className="w-3"
                            />
                        </div>
                        <div className="my-1">
                            <Button
                                type="primary"
                                className="mr-1"
                                onClick={() => {
                                    // update the number of rows and columns the grid is comprised of
                                    const rows = this.rowRef.current.state.value;
                                    const cols = this.colRef.current.state.value;

                                    this.props.updateFormLayout({
                                        rows,
                                        cols,
                                        gridModel: this.generateGridModel(rows, cols)
                                    });

                                    this.setState({
                                        joinModel: new Array(rows).fill(new Array(cols).fill(''))
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

                                        // figure out the extrema of the used slots in the the matrix to determine if it is a rectangle
                                        let rMin = Number.MAX_SAFE_INTEGER,
                                            rMax = Number.MIN_SAFE_INTEGER;
                                        let cMin = Number.MAX_SAFE_INTEGER,
                                            cMax = Number.MIN_SAFE_INTEGER;

                                        for (let i = 0; i < this.props.formLayout.rows; i++) {
                                            for (let j = 0; j < this.props.formLayout.cols; j++) {
                                                const notEmpty = this.state.joinModel[i][j] !== '';
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

                                        // condition to prevent errors from not selecting anything
                                        if (rMax - rMin + 1 > 0 && cMax - cMin + 1 > 0) {
                                            // build a new matrix that is homed in on the selected region
                                            const newMatrix = new Array(rMax - rMin + 1).fill(
                                                new Array(cMax - cMin + 1).fill('')
                                            );
                                            for (let i = rMin; i <= rMax; i++) {
                                                for (let j = cMin; j <= cMax; j++) {
                                                    console.log(
                                                        `newMatrix[${i - rMin}][${j - cMin}] = m[${i}][${j}] = ${
                                                            this.state.joinModel[i][j]
                                                        }`
                                                    );
                                                    newMatrix[i - rMin][j - cMin] = this.state.joinModel[i][j];
                                                }
                                            }

                                            // if it contains any empty slots, it is not a rectangle
                                            let emptySlot = false;
                                            newMatrix.forEach(row => {
                                                if (row.includes('')) {
                                                    emptySlot = true;
                                                }
                                            });

                                            if (emptySlot) {
                                                message.error('Please make sure your selection is rectangular', 2);
                                            } else {
                                                // the first letter that is found will be used to make the remaining slots match
                                                let firstLetter = '';

                                                const cpy = this.props.formLayout.gridModel.map(cols =>
                                                    cols.map(str => str)
                                                );
                                                for (let i = 0; i < this.props.formLayout.rows; i++) {
                                                    for (let j = 0; j < this.props.formLayout.cols; j++) {
                                                        if (this.state.joinModel[i][j] !== '') {
                                                            if (firstLetter === '') {
                                                                firstLetter = this.state.joinModel[i][j];
                                                            }
                                                            cpy[i][j] = firstLetter;
                                                        }
                                                    }
                                                }

                                                // this.props.setFormDimensions(this.state.rows, this.state.cols, cpy);
                                                this.setState({
                                                    joinModel: new Array(this.props.formLayout.rows).fill(
                                                        new Array(this.props.formLayout.cols).fill('')
                                                    ),
                                                    isJoiningGrid: !this.state.isJoiningGrid
                                                });
                                                this.props.updateFormLayout({ gridModel: cpy });
                                            }
                                        } else {
                                            // since nothing was selected, reset to before
                                            this.setState({
                                                joinModel: new Array(this.props.formLayout.rows).fill(
                                                    new Array(this.props.formLayout.cols).fill('')
                                                ),
                                                isJoiningGrid: !this.state.isJoiningGrid
                                            });
                                        }
                                    } else {
                                        // the user wants to select grids to merge
                                        this.setState({
                                            isJoiningGrid: !this.state.isJoiningGrid
                                        });
                                    }
                                }}
                            >
                                {this.state.isJoiningGrid ? 'Confirm' : 'Join'}
                            </Button>
                        </div>
                    </div>
                    <div className="form-creator__editor--groups">
                        {...this.props.groups.map(group =>
                            !includes2d(this.props.formLayout.gridModel, group.getGridAreaName()) ? (
                                <DraggableGroup disabled={true} group={group} canDrag={!this.state.isJoiningGrid} />
                            ) : (
                                <span></span>
                            )
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
