import { EventData, StateData } from '../types/types';

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

/**
 * Takes an array of strings representing bool variable names and ands them together
 *
 * ex: ['var1', 'var2', 'var3'] -> 'var1 && var2 && var3'
 *
 * @param strings - array of strings to operate on
 */
export const andBoolStrings = (strings: Array<string>) => {
    console.log(strings);
    let and = '';
    for (let i = 0; i < strings.length - 1; i++) {
        and += strings[i] + ' && ';
        console.log(and);
    }
    console.log(and);
    and += strings[strings.length - 1];
    console.log(and);
    return and;
};

/**
 * Returns true if the passed data is of type EventData, false if of type StateData
 * @param data
 */
export const isEventData = (data: EventData | StateData): data is EventData => {
    return (data as EventData).type !== undefined;
};

/**
 * Generates a string representing the row dimensions for a grid
 *
 * ex 2->"10% 45% 45%"
 *
 * @param rowCount - the number of rows there are in the grid
 */
export const generateGridRowString = (rowCount: number) => {
    let rows = '10% ';
    let percentage = `${90.0 / (rowCount - 1)}%`;
    for (let i = 1; i < rowCount; i++) {
        if (i < rowCount - 1) {
            rows += percentage + ' ';
        } else {
            rows += percentage;
        }
    }
    return rows;
};

/**
 * Generates a string representing the column dimensions for a grid
 *
 * ex 3->"1fr 1fr 1fr"
 *
 * @param colCount - the number of columns there are in the grid
 */
export const generateGridColString = (colCount: number) => {
    let cols = '';
    for (let i = 0; i < colCount; i++) {
        if (i < colCount - 1) {
            cols += '1fr ';
        } else {
            cols += '1fr';
        }
    }
    return cols;
};
