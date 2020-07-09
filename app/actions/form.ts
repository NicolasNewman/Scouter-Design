export enum FormTypeKeys {
    SET_FORM_JSX_FUNC = 'SET_FORM_JSX_FUNC'
}

interface SetFormJSXFuncAction {
    type: FormTypeKeys.SET_FORM_JSX_FUNC;
    func: () => string;
}

export type FormTypes = SetFormJSXFuncAction;

export function setFormJSXFunc(func: () => string) {
    return {
        type: FormTypeKeys.SET_FORM_JSX_FUNC,
        func
    };
}

export default { setFormJSXFunc };
