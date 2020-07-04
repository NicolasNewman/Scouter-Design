import FormButton from './FormButton';

export type GroupOptions = {
    cols?: string;
    rows?: string;
    templareArea?: string;
    gridAreaName?: string;
    name: string;
};

export default class FormGroup {
    private cols: string;
    private rows: string;
    private templateArea: string;
    private gridAreaName: string;
    private name: string;
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

    addButton(button: FormButton) {
        this.formButtons.push(button);
    }

    getJSX() {
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
                <AccuracyEventButton
                    gridAreaName="outer"
                    constants={this.constantProps}
                    // label="Outer"
                    label="Top"
                    type={EScorableRobotEvents.POWERCELLS_OUTER}
                    disabled={this.state.globalDisabled}
                    phase={
                        this.state.phase === "NONE" ? "AUTO" : this.state.phase
                    }
                />,
                <RobotEventButton
                    gridAreaName="hang"
                    constants={this.constantProps}
                    label="Hang"
                    type={EScorableRobotEvents.HANG}
                    disabled={
                        this.state.globalDisabled ||
                    t   his.state.endgameButtonsDisabled
                    }
                    phase={
                        this.state.phase === "NONE" ? "AUTO" : this.state.phase
                    }
                />,
                <StateButton
                    gridAreaName="wheel"
                    constants={this.constantProps}
                    label="Wheel"
                    type={ERobotStates.WHEEL}
                    disabled={
                        this.state.globalDisabled ||
                        (this.state.teleopButtonsDisabled &&
                        this.state.endgameButtonsDisabled)
                    }
                    phase={
                        this.state.phase === "NONE" ? "AUTO" : this.state.phase
                    }
                />,
            ]}
        />,`;
    }
}
