import { FormTypeKeys, FormTypes } from '../actions/form';
import FormGroup from '../classes/models/FormGroup';
import { FormLayoutType } from '../types/types';

interface IInitialState {
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
        ],
        groupList: []
    }
};

export default function file(state: IInitialState = initialState, action: FormTypes) {
    switch (action.type) {
        case FormTypeKeys.SET_FORM_JSX_FUNC:
            return {
                generateForm: action.func,
                formLayout: state.formLayout
            };
        case FormTypeKeys.SET_FORM_DIMENSIONS:
            return {
                generateForm: state.generateForm,
                formLayout: {
                    rows: action.rows,
                    cols: action.cols,
                    gridModel: action.gridModel,
                    groupList: state.formLayout.groupList
                }
            };
        case FormTypeKeys.ADD_FORM_GROUP:
            console.log(state);
            return {
                generateForm: state.generateForm,
                formLayout: {
                    rows: state.formLayout.rows,
                    cols: state.formLayout.cols,
                    gridModel: state.formLayout.gridModel,
                    groupList: state.formLayout.groupList.push(action.group)
                }
            };
        case FormTypeKeys.REMOVE_FORM_GROUP:
            let cpy = [...state.formLayout.groupList];
            cpy = cpy.filter(group => {
                return action.group.getGridAreaName() !== group.getGridAreaName();
            });
            return {
                generateForm: state.generateForm,
                formLayout: {
                    rows: state.formLayout.rows,
                    cols: state.formLayout.cols,
                    gridModel: state.formLayout.gridModel,
                    groupList: cpy
                }
            };
        case FormTypeKeys.OVERWRITE_FORM_GROUP:
            return {
                generateForm: state.generateForm,
                formLayout: {
                    rows: state.formLayout.rows,
                    cols: state.formLayout.cols,
                    gridModel: state.formLayout.gridModel,
                    groupList: action.groups
                }
            };
        default:
            return state;
    }
}
