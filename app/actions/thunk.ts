import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { IStore, EventData } from '../types/types';
import FormGroup from '../classes/models/FormGroup';

import { updateGroup } from './group';
import { updateEventItem } from './event';

export const updateEventAndDependents = (
    name: string,
    newData: EventData
): ThunkAction<Promise<void>, IStore, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<IStore, {}, AnyAction>, getState): Promise<void> => {
        const processGroup = (group: FormGroup) => {
            console.log(`Processing group`);
            const cpy = FormGroup.fromJSON(group.toJSON());

            // loop through each renderButton of the group
            let changed = false;
            cpy.getRenderButtons().forEach(renderButton => {
                console.log(renderButton);
                // If the renderButton's type is equal to the name of the previous type
                if (renderButton.type === name) {
                    cpy.updateRenderButton(
                        renderButton.gridAreaName,
                        renderButton.label,
                        renderButton.checkbox,
                        newData.name,
                        newData.accuracy
                    );
                    changed = true;
                }
            });
            return changed ? cpy : null;
        };

        return new Promise<void>(async (res, rej) => {
            await dispatch(updateEventItem(name, newData));
            const state = getState();

            // loop through each group
            console.log('========== Inside of thunk ==========');
            console.log(`Name is: ${name}`);
            console.log(`New data is:`);
            console.log(newData);
            console.log('The current state is: ');
            console.log(state);
            state.group.forEach(async group => {
                const cpy = processGroup(group);
                if (cpy) {
                    await dispatch(updateGroup(cpy.getGridAreaName(), cpy));
                }
            });

            // const newFormGroups: FormGroup[] = [];
            // state.form.formLayout.groupList.forEach(async group => {
            //     const cpy = processGroup(group);
            //     if (cpy) {
            //         newFormGroups.push(cpy);
            //     } else {
            //         newFormGroups.push(group);
            //     }
            // });
            // await dispatch(overwriteFormGroup(newFormGroups));

            res();
            // await dispatch(updateGroup());
        });
    };
};

export default { updateEventAndDependents };
