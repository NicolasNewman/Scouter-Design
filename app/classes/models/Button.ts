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
                return ``;
            case 'state':
                return ``;
            case 'accuracy':
                return ``;
        }
    }
}
