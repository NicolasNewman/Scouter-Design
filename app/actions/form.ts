import FormGroup from '../classes/models/FormGroup';

export enum FormTypeKeys {
    SET_FORM_JSX_FUNC = 'SET_FORM_JSX_FUNC',
    SET_FORM_DIMENSIONS = 'SET_FORM_DIMENSIONS',
    ADD_FORM_GROUP = 'ADD_FORM_GROUP',
    REMOVE_FORM_GROUP = 'REMOVE_FORM_GROUP',
    OVERWRITE_FORM_GROUP = 'OVERWRITE_FORM_GROUP'
}

interface SetFormJSXFuncAction {
    type: FormTypeKeys.SET_FORM_JSX_FUNC;
    func: () => string;
}

interface SetFormDimensions {
    type: FormTypeKeys.SET_FORM_DIMENSIONS;
    rows: number;
    cols: number;
    gridModel: Array<Array<string>>;
}

interface AddFormGroup {
    type: FormTypeKeys.ADD_FORM_GROUP;
    group: FormGroup;
}

interface RemoveFormGroup {
    type: FormTypeKeys.REMOVE_FORM_GROUP;
    group: FormGroup;
}

interface OverwriteFormGroup {
    type: FormTypeKeys.OVERWRITE_FORM_GROUP;
    groups: Array<FormGroup>;
}

export type FormTypes = SetFormJSXFuncAction | SetFormDimensions | AddFormGroup | RemoveFormGroup | OverwriteFormGroup;

export function setFormJSXFunc(func: () => string) {
    return {
        type: FormTypeKeys.SET_FORM_JSX_FUNC,
        func
    };
}

export function setFormDimensions(rows: number, cols: number, gridModel: Array<Array<string>>) {
    return {
        type: FormTypeKeys.SET_FORM_DIMENSIONS,
        rows,
        cols,
        gridModel
    };
}

export function addFormGroup(group: FormGroup) {
    return {
        type: FormTypeKeys.ADD_FORM_GROUP,
        group
    };
}

export function removeFormGroup(group: FormGroup) {
    return {
        type: FormTypeKeys.REMOVE_FORM_GROUP,
        group
    };
}

export function overwriteFormGroup(groups: Array<FormGroup>) {
    return {
        type: FormTypeKeys.OVERWRITE_FORM_GROUP,
        groups
    };
}

export default { setFormJSXFunc, setFormDimensions, addFormGroup, removeFormGroup, overwriteFormGroup };
