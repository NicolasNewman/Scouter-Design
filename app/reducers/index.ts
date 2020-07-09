import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import core from './core';
import game from './game';
import event from './event';
import state from './state';
import group from './group';
import form from './form';
import { History } from 'history';

export default function createRootReducer(history: History) {
    return combineReducers({
        router: connectRouter(history),
        core,
        game,
        event,
        state,
        group,
        form
    });
}
