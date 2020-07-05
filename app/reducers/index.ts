import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import core from './core';
import event from './event';
import state from './state';
import group from './group';
import { History } from 'history';

export default function createRootReducer(history: History) {
    return combineReducers({
        router: connectRouter(history),
        core,
        event,
        state,
        group
    });
}
