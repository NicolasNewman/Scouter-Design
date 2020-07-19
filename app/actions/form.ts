import FormGroup from '../classes/models/FormGroup';
import { FormLayoutType } from '../types/types';

export enum FormTypeKeys {
    SET_FORM_JSX_FUNC = 'SET_FORM_JSX_FUNC',
    UPDATE_FORM_LAYOUT = 'UPDATE_FORM_LAYOUT'
}

interface SetFormJSXFuncAction {
    type: FormTypeKeys.SET_FORM_JSX_FUNC;
    func: () => string;
}

interface UpdateFormLayout {
    type: FormTypeKeys.UPDATE_FORM_LAYOUT;
    options: Partial<FormLayoutType>;
}

export type FormTypes = SetFormJSXFuncAction | UpdateFormLayout;

export function setFormJSXFunc(func: () => string) {
    return {
        type: FormTypeKeys.SET_FORM_JSX_FUNC,
        func
    };
}

export function updateFormLayout(options: Partial<FormLayoutType>) {
    return {
        type: FormTypeKeys.UPDATE_FORM_LAYOUT,
        options
    };
}

export default {
    setFormJSXFunc,
    updateFormLayout
};
