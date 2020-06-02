import * as React from 'react';
import { Component } from 'react';
import { Switch, Route } from 'react-router';
const routes = require('./constants/routes.json');
import sizes from './constants/sizes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import DesignerPage from './containers/DesignerPage';
import DataStore from './classes/DataStore';
import IpcInterface from './classes/IpcInterface';

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
                            <DesignerPage dataStore={this.dataStore} />;
                        }}
                    />
                </Switch>
            </App>
        );
    }
}
