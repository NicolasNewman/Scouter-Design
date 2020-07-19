import { FormTypeKeys, FormTypes } from '../actions/form';
import FormGroup from '../classes/models/FormGroup';
import { FormLayoutType } from '../types/types';

export interface IInitialState {
    generateForm: () => string;
    formLayout: FormLayoutType;
}

const initialState: IInitialState = {
    generateForm: null,
    formLayout: {
        rows: 2,
        cols: 2,
        gridModel: [
            ['A', 'B'],
            ['C', 'D']
        ]
    }
};

export default function file(state: IInitialState = initialState, action: FormTypes) {
    switch (action.type) {
        case FormTypeKeys.SET_FORM_JSX_FUNC:
            return {
                generateForm: action.func,
                formLayout: state.formLayout
            };
        case FormTypeKeys.UPDATE_FORM_LAYOUT:
            return {
                generateForm: state.generateForm,
                formLayout: {
                    rows: action.options.rows ? action.options.rows : state.formLayout.rows,
                    cols: action.options.cols ? action.options.cols : state.formLayout.cols,
                    gridModel: action.options.gridModel ? action.options.gridModel : state.formLayout.gridModel
                }
            };
        default:
            return state;
    }
}
