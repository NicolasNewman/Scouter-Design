import { ButtonType } from '../../types/types';

type ButtonOptions = {
    buttonType: ButtonType;
    gridAreaName?: string;
    label?: string;
    type?: string;
    disabled?: string;
};

/**
 * Models for a button on Scouter's scouting form
 */
export default class FormButton {
    // the type of button that should be generated
    private buttonType: ButtonType;
    // the identifier used by the parent grid for placement
    private gridAreaName: string;
    // the text that the button displays
    private label: string;
    // the type of the button (used by Scouter's backend to keep track of which signal corresponds to which data record)
    private type: string;
    // the condition that determines when this button should be disabled
    private disabled: string;

    constructor(options: ButtonOptions) {
        this.buttonType = options.buttonType;
        this.gridAreaName = options.gridAreaName;
        this.label = options.label;
        this.type = options.type;
        this.disabled = options.disabled;
    }

    setButtonType = (buttonType: ButtonType) => (this.buttonType = buttonType);
    setGridAreaName = (gridAreaName: string) =>
        (this.gridAreaName = gridAreaName);
    setLabel = (label: string) => (this.label = label);
    setType = (type: string) => (this.type = type);
    setDisabled = (condition: string) => (this.disabled = condition);

    getGridAreaName = () => this.gridAreaName;

    /**
     * Converts the button into the code needed to be rendered within Scouter
     */
    getJSX() {
        switch (this.buttonType) {
            case 'event':
                return `
                <RobotEventButton
                    gridAreaName="${this.gridAreaName}"
                    constants={this.constantProps}
                    label="${this.label}"
                    type={${this.type}}
                    disabled={
                        this.state.globalDisabled ||
                        (${this.disabled})
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
                    type={${this.type}}
                    disabled={
                        this.state.globalDisabled ||
                        (${this.disabled})
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
                    type={${this.type}}
                    disabled={
                        this.state.globalDisabled ||
                        (${this.disabled})
                    }
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
