import { FormTypeKeys, FormTypes } from '../actions/form';

export default function file(state: () => string = null, action: FormTypes) {
    switch (action.type) {
        case FormTypeKeys.SET_FORM_JSX_FUNC:
            return action.func;
        default:
            return state;
    }
}
