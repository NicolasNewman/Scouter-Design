import * as React from 'react';
import { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import routes from './constants/routes';
import sizes from './constants/sizes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import DesignerPage from './containers/DesignerPage';
import DataStore from './classes/DataStore';
import IpcInterface from './classes/IpcInterface';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default class Routes extends Component {
    private dataStore: DataStore = new DataStore();
    private ipcInterface: IpcInterface = new IpcInterface();

    render() {
        return (
            <App>
                <Switch>
                    <Route
                        path={routes.HOME}
                        component={() => {
                            this.ipcInterface.resizeWindow(
                                sizes.homeWindow.width,
                                sizes.homeWindow.height
                            );
                            return <HomePage dataStore={this.dataStore} />;
                        }}
                    />
                    <Route
                        path={routes.DESIGNER}
                        component={() => {
                            this.ipcInterface.resizeWindow(
                                sizes.designerWindow.width,
                                sizes.designerWindow.height
                            );
                            return (
                                <DndProvider backend={HTML5Backend}>
                                    <DesignerPage dataStore={this.dataStore} />
                                </DndProvider>
                            );
                        }}
                    />
                    <Redirect from="/" to="/home" />
                </Switch>
            </App>
        );
    }
}
