/**
 * Formats an event name to ensure it can be properly read by Scouter
 * @param name - the original name of the event
 */
export const formatEventName = (name: string): string => {
    console.log(name);
    console.log(typeof name);
    let formated = name.replace(/ /g, '_').toUpperCase();
    return formated.substr(0, 5) === 'EVENT' ? formated : `EVENT_${formated}`;
};

/**
 * Formats a state name to ensure it can be properly read by Scouter
 * @param name - the original name of the state
 */
export const formatStateName = (name: string): string => {
    let formated = name.replace(/ /g, '_').toUpperCase();
    return formated.substr(0, 5) === 'STATE' ? formated : `STATE_${formated}`;
};
