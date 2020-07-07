import * as React from 'react';
import FormButton from './FormButton';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { ButtonOptions } from './FormButton';
import {
    generateGridColString,
    generateGridRowString
} from '../../utils/helper';

export type GroupOptions = {
    renderButtons?: Array<RenderButton>;
    formButtons?: Array<FormButton>;
    formButtonOpt?: Array<ButtonOptions>;
    colCount?: number;
    rowCount?: number;
    templareArea?: string;
    gridAreaName?: string;

    name: string;
};

type RenderButton = {
    label: string;
    gridAreaName: string;
    checkbox?: Array<CheckboxValueType>;
    type?: string;
    accuracy?: boolean;
};

/**
 * Models for a group of buttons on Scouter's scouting form
 */
export default class FormGroup {
    // how many columns of buttons are in the group
    private cols: string;
    private colCount: number;
    // how many rows of buttons are in the group
    private rows: string;
    private rowCount: number;
    // the order to arrange each button within the group
    private templateArea: string;
    // the identifier used by the parent grid for placement
    private gridAreaName: string;
    // the name displayed on the top of the group within Scouter
    private name: string;
    // list of each button within the group
    private formButtons: Array<FormButton>;
    // list of each button used for rendering
    private renderButtons: Array<RenderButton>;

    constructor(options: GroupOptions) {
        this.formButtons = options.formButtonOpt
            ? options.formButtonOpt.map(opt => FormButton.fromJSON(opt))
            : [];
        this.renderButtons = options.renderButtons ? options.renderButtons : [];
        this.colCount = options.colCount ? options.colCount : 2;
        this.rowCount = options.rowCount ? options.rowCount : 3;
        this.updateCols();
        this.updateRows();

        this.templateArea = options.templareArea;
        if (!this.templateArea) {
            this.updateTemplateArea();
        }
        this.gridAreaName = options.gridAreaName;
        this.name = options.name;
        console.log(this.toString());
    }

    toJSON() {
        return {
            formButtonOpt: this.formButtons.map(button => button.toJSON()),
            renderButtons: this.renderButtons,
            colCount: this.colCount,
            rowCount: this.rowCount,
            templateArea: this.templateArea,
            gridAreaName: this.gridAreaName,
            name: this.name
        } as GroupOptions;
    }

    static fromJSON(options: GroupOptions): FormGroup {
        return new FormGroup(options);
    }

    /**
     * Update the cols variable to match the number specified by colCount
     */
    private updateCols = () => {
        this.cols = generateGridColString(this.colCount);
        this.updateTemplateArea();
    };

    /**
     * Update the rows variable to match the number specified by rowCount
     *
     * 10% should be reserved for the group header and the remaining is evenly split
     */
    private updateRows = () => {
        this.rows = generateGridRowString(this.rowCount);
        this.updateTemplateArea();
    };

    /**
     * Generate the group's grid template area based on the number of rows and columns
     *
     * Used to determine where each button should be placed on the grid
     */
    private updateTemplateArea = () => {
        let templateArea = '';
        let row = "'";
        for (let j = 0; j < this.colCount; j++) {
            row += 'title ';
        }
        row = row.replace(/\s+(?=\S*$)/g, "'\n"); // replace last space
        templateArea += row;

        for (let i = 1; i < this.rowCount; i++) {
            row = "'";
            for (let j = 0; j < this.colCount; j++) {
                row += `r${i}c${j} `;
                this.addRenderButton(`r${i}c${j}`);
            }
            row = row.replace(/\s+(?=\S*$)/g, "'\n"); // replace last space
            templateArea += row;
        }

        this.templateArea = templateArea;
        this.removeUnusedRenderButtons();
    };

    /**
     *
     * @param index - the locational index for the group's button, in the format r#c#
     */
    private addRenderButton = (index: string) => {
        const detected = this.renderButtons.find(button => {
            return button.gridAreaName === index;
        });
        if (!detected) {
            this.renderButtons.push({ label: '+', gridAreaName: index });
        }
    };

    /**
     * Removes render buttons that fall outside the range of colCount and rowCount
     */
    private removeUnusedRenderButtons = () => {
        this.renderButtons = this.renderButtons.filter(button => {
            const i = parseInt(button.gridAreaName.charAt(1));
            const j = parseInt(button.gridAreaName.charAt(3));
            return this.rowCount - i > 0 && this.colCount - j > 0;
        });
    };

    toString = () => {
        return `
        name: ${this.name}
        gridAreaName: ${this.gridAreaName}
        dimensions: ${this.rowCount}x${this.colCount}
        row template: "${this.rows}"
        col template: "${this.cols}"
        template area: \n${this.templateArea}`;
    };

    setCols = (cols: string) => {
        this.cols = cols;
        this.colCount = this.cols.replace(/[^ ]/g, '').length + 1; // the number of columns can be computed by # of spaces + 1 (1fr 1fr 1fr = 2 + 1)
        this.updateTemplateArea();
    };

    setColCount = (colCount: number) => {
        this.colCount = colCount;
        let cols = '';
        for (let i = 0; i < colCount; i++) {
            if (i < colCount - 1) {
                cols += '1fr ';
            } else {
                cols += '1fr';
            }
        }
        this.cols = cols;
        this.updateTemplateArea();
    };

    setRows = (rows: string) => {
        this.rows = rows;
        this.rowCount = this.rows.replace(/[^ ]/g, '').length + 1; // the number of rows can be computed by # of spaces + 1 (10% 90% = 1 + 1)
        this.updateTemplateArea();
    };

    setRowCount = (rowCount: number) => {
        this.rowCount = rowCount;
        let rows = '10% ';
        // computes how the remaining 90% should be evenly divided (rowCount - 1 b/c the 10% of the header is included)
        let percentage = `${90.0 / (rowCount - 1)}%`;
        for (let i = 1; i < rowCount; i++) {
            if (i < rowCount - 1) {
                rows += percentage + ' ';
            } else {
                rows += percentage;
            }
        }
        this.rows = rows;
        this.updateTemplateArea();
    };

    setTemplateArea = (templateArea: string) =>
        (this.templateArea = templateArea);
    setName = (name: string) => (this.name = name);
    setGridAreaName = (gridAreaName: string) =>
        (this.gridAreaName = gridAreaName);

    getName = () => this.name;
    getGridAreaName = () => this.gridAreaName;
    getTemplateArea = () => this.templateArea;

    getRowCount = () => this.rowCount;
    getColCount = () => this.colCount;

    getRow = () => this.rows;
    getCol = () => this.cols;

    getRenderButtons = () => this.renderButtons;

    /**
     * Inserts a FormButton into the group's array. If the button already exists, it will be updated
     * @param insert - the FormButton to insert into the array
     */
    insertButton(insert: FormButton) {
        const filtered = this.formButtons.filter(
            button => button.getGridAreaName() !== insert.getGridAreaName()
        );
        const updated = [...filtered, insert];
        this.formButtons = updated;

        // this.updateRenderButton(insert);
    }

    updateRenderButton = (
        gridAreaName: string,
        label: string,
        checkbox: Array<CheckboxValueType>,
        type: string,
        accuracy: boolean
    ) => {
        const filtered = this.renderButtons.filter(
            btn => btn.gridAreaName !== gridAreaName
        );
        this.renderButtons = [
            ...filtered,
            { gridAreaName, label, checkbox, type, accuracy }
        ];
    };

    /**
     * Converts the group model and its buttons into the code needed to be rendered within Scouter
     */
    getJSX(): string {
        return `
        <Grid
            gridAreaName="${this.gridAreaName}"
            className="input-grid__child"
            cols="${this.cols}"
            rows="${this.rows}"
            templateArea="${this.templateArea}"
            gridElements={[
                <div className="input-grid__title">
                    <p>${this.name}</p>
                </div>,
                ${(() => {
                    // insert each button's corresponding JSX into the group's grid
                    return this.formButtons
                        .map(button => button.getJSX())
                        .join('');
                })()}
            ]}
        />,`;
    }
}
