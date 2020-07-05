import FormButton from './FormButton';

type GroupOptions = {
    cols?: string;
    rows?: string;
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
    // how many rows of buttons are in the group
    private rows: string;
    // the order to arrange each button within the group
    private templateArea: string;
    // the identifier used by the parent grid for placement
    private gridAreaName: string;
    // the name displayed on the top of the group within Scouter
    private name: string;
    // list of each button within the group
    private formButtons: Array<FormButton>;

    constructor(options: GroupOptions) {
        this.cols = options.cols;
        this.rows = options.rows;
        this.templateArea = options.templareArea;
        this.gridAreaName = options.gridAreaName;
        this.name = options.name;
        this.formButtons = [];
    }

    setName = (name: string) => (this.name = name);
    setCols = (cols: string) => (this.cols = cols);
    setRows = (rows: string) => (this.rows = rows);
    setTemplateArea = (templateArea: string) =>
        (this.templateArea = templateArea);
    setGridAreaName = (gridAreaName: string) =>
        (this.gridAreaName = gridAreaName);

    getName = () => this.name;
    getGridAreaName = () => this.gridAreaName;

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
