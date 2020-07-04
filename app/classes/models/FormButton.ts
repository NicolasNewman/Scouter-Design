export type ButtonType = 'event' | 'state' | 'accuracy';

export type ButtonOptions = {
    buttonType: ButtonType;
    gridAreaName?: string;
    label?: string;
    type?: string;
};

export default class Button {
    private buttonType: ButtonType;
    private gridAreaName: string;
    private label: string;
    private type: string;

    constructor(options: ButtonOptions) {
        this.buttonType = options.buttonType;
        this.gridAreaName = options.gridAreaName;
        this.label = options.label;
        this.type = options.type;
    }

    setButtonType = (buttonType: ButtonType) => (this.buttonType = buttonType);
    setGridAreaName = (gridAreaName: string) =>
        (this.gridAreaName = gridAreaName);
    setLabel = (label: string) => (this.label = label);
    setType = (type: string) => (this.type = type);

    getJSX() {
        switch (this.buttonType) {
            case 'event':
                return `
                <RobotEventButton
                    gridAreaName="${this.gridAreaName}"
                    constants={this.constantProps}
                    label="${this.label}"
                    type={EScorableRobotEvents.HANG}
                    disabled={
                        this.state.globalDisabled ||
                    t   his.state.endgameButtonsDisabled
                    }
                    phase={
                        this.state.phase === "NONE" ? "AUTO" : this.state.phase
                    }
                />,
                `;
            case 'state':
                return `
                <StateButton
                    gridAreaName="${this.gridAreaName}"
                    constants={this.constantProps}
                    label="${this.label}"
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
                `;
            case 'accuracy':
                return `
                <AccuracyEventButton
                    gridAreaName="${this.gridAreaName}"
                    constants={this.constantProps}
                    label="${this.label}"
                    type={EScorableRobotEvents.POWERCELLS_OUTER}
                    disabled={this.state.globalDisabled}
                    phase={
                        this.state.phase === "NONE" ? "AUTO" : this.state.phase
                    }
                />,
                `;
            default:
                // TODO throw error
                break;
        }
    }
}
