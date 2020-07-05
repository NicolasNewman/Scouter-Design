import { GroupActionTypeKeys, GroupActionTypes } from '../actions/group';
import FormGroup from '../classes/models/FormGroup';

const initialState: Array<FormGroup> = [
    new FormGroup({ name: 'Goal Events', gridAreaName: 'goalEvents' })
];

export default function group(
    state: Array<FormGroup> = initialState,
    action: GroupActionTypes
) {
    switch (action.type) {
        case GroupActionTypeKeys.ADD_GROUP:
            return [...state, action.group];
        case GroupActionTypeKeys.REMOVE_GROUP:
            return state.filter(group => {
                return !(
                    group.getGridAreaName() === action.group.getGridAreaName()
                );
            });
        case GroupActionTypeKeys.UPDATE_GROUP:
            const filteredData = state.filter(group => {
                return !(group.getGridAreaName() === action.key);
            });
            return [...filteredData, action.newGroup];
        case GroupActionTypeKeys.OVERWRITE_GROUP:
            return action.groups;
        default:
            return state;
    }
}
