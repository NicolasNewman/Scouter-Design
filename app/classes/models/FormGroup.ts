import FormButton from './FormButton';

type GroupOptions = {
    colCount?: number;
    rowCount?: number;
    templareArea?: string;
    gridAreaName?: string;
    name: string;
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

    constructor(options: GroupOptions) {
        this.colCount = options.colCount ? options.colCount : 2;
        this.updateCols();
        this.rowCount = options.rowCount ? options.rowCount : 3;
        this.updateRows();
        this.templateArea = options.templareArea;
        this.gridAreaName = options.gridAreaName;
        this.name = options.name;
        this.formButtons = [];
    }

    private updateCols = () => {
        let cols = '';
        for (let i = 0; i < this.colCount; i++) {
            if (i < this.colCount - 1) {
                cols += '1fr ';
            } else {
                cols += '1fr';
            }
        }
        this.cols = cols;
    };

    private updateRows = () => {
        let rows = '10% ';
        let percentage = `${90.0 / (this.rowCount - 1)}%`;
        for (let i = 1; i < this.rowCount; i++) {
            if (i < this.rowCount - 1) {
                rows += percentage + ' ';
            } else {
                rows += percentage;
            }
        }
        this.rows = rows;
    };

    toString = () => {
        return `
        name: ${this.name}
        gridAreaName: ${this.gridAreaName}
        dimensions: ${this.rowCount}x${this.colCount}
        row template: "${this.rows}"
        col template: "${this.cols}"`;
    };

    setCols = (cols: string) => {
        this.cols = cols;
        this.colCount = this.cols.replace(/[^ ]/g, '').length + 1;
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
    };

    setRows = (rows: string) => {
        this.rows = rows;
        this.rowCount = this.rows.replace(/[^ ]/g, '').length + 1;
    };
    setRowCount = (rowCount: number) => {
        this.rowCount = rowCount;
        let rows = '10% ';
        let percentage = `${90.0 / (rowCount - 1)}%`;
        for (let i = 1; i < rowCount; i++) {
            if (i < rowCount - 1) {
                rows += percentage + ' ';
            } else {
                rows += percentage;
            }
        }
        this.rows = rows;
    };

    setTemplateArea = (templateArea: string) =>
        (this.templateArea = templateArea);
    setName = (name: string) => (this.name = name);
    setGridAreaName = (gridAreaName: string) =>
        (this.gridAreaName = gridAreaName);

    getName = () => this.name;
    getGridAreaName = () => this.gridAreaName;

    getRowCount = () => this.rowCount;
    getColCount = () => this.colCount;

    addButton(button: FormButton) {
        this.formButtons.push(button);
    }

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
