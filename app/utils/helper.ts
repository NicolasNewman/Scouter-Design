/**
 * Formats an event name to ensure it can be properly read by Scouter
 * @param name - the original name of the event
 */
export const formatEventName = (name: string): string => {
    let formated = name.replace(/ /g, '_').toUpperCase(); // replace all spaces with _ and convert to upper case
    return formated.substr(0, 5) === 'EVENT' ? formated : `EVENT_${formated}`;
};

/**
 * Formats a state name to ensure it can be properly read by Scouter
 * @param name - the original name of the state
 */
export const formatStateName = (name: string): string => {
    let formated = name.replace(/ /g, '_').toUpperCase(); // replace all spaces with _ and convert to upper case
    return formated.substr(0, 5) === 'STATE' ? formated : `STATE_${formated}`;
};

/**
 * Converts the passed string from any casing into camel case
 * eg: "Goal Shot Events" -> "goalShotEvents"
 *
 * https://stackoverflow.com/questions/2970525
 *
 * @param str - the string to convert to camel case
 */
export const toCamelCase = str => {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
};
