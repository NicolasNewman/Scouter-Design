import { EventData, EventDataArray } from '../types/types';
import FormGroup from '../classes/models/FormGroup';

export enum GroupActionTypeKeys {
    ADD_GROUP = 'ADD_GROUP',
    REMOVE_GROUP = 'REMOVE_GROUP',
    UPDATE_GROUP = 'UPDATE_GROUP',
    OVERWRITE_GROUP = 'OVERWRITE_GROUP'
}

interface AddGroupAction {
    type: GroupActionTypeKeys.ADD_GROUP;
    group: FormGroup;
}

interface RemoveGroupAction {
    type: GroupActionTypeKeys.REMOVE_GROUP;
    group: FormGroup;
}

interface UpdateGroupAction {
    type: GroupActionTypeKeys.UPDATE_GROUP;
    newGroup: FormGroup;
    key: string;
}

interface OverwriteGroupAction {
    type: GroupActionTypeKeys.OVERWRITE_GROUP;
    groups: Array<FormGroup>;
}

export type GroupActionTypes =
    | AddGroupAction
    | RemoveGroupAction
    | UpdateGroupAction
    | OverwriteGroupAction;

export function addGroup(group: FormGroup) {
    return {
        type: GroupActionTypeKeys.ADD_GROUP,
        group
    };
}

export function removeGroup(group: FormGroup) {
    return {
        type: GroupActionTypeKeys.REMOVE_GROUP,
        group
    };
}

export function updateGroup(key: string, newGroup: FormGroup) {
    return {
        type: GroupActionTypeKeys.UPDATE_GROUP,
        key,
        newGroup
    };
}

export function overwriteGroup(groups: Array<FormGroup>) {
    return {
        type: GroupActionTypeKeys.OVERWRITE_GROUP,
        groups
    };
}

export default {
    addGroup,
    removeGroup,
    updateGroup,
    overwriteGroup
};
