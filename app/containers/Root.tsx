import * as React from 'react';
import { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

import Routes from '../Routes';
import { History } from 'history';

type Props = {
    store: any;
    history: History<any>;
};

export default class Root extends Component<Props> {
    render() {
        const { store, history } = this.props;
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Routes />
                </ConnectedRouter>
            </Provider>
        );
    }
}
