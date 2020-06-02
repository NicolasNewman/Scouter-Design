export enum CoreTypeKeys {
    SET_PROJECT_STATUS = 'SET_PROJECT_STATUS'
}

interface SetProjectStatusAction {
    type: CoreTypeKeys.SET_PROJECT_STATUS;
    status: boolean;
}

export type CoreTypes = SetProjectStatusAction;

export function setProjectStatus(status: boolean) {
    return {
        type: CoreTypeKeys.SET_PROJECT_STATUS,
        status
    };
}

export default { setProjectStatus };
