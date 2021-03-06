import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import DataStore from 'app/classes/DataStore';
import { Button } from 'antd';
import routes from '../constants/routes';
import { EXTENSION_SDW } from '../constants/constants';
import { remote } from 'electron';
import { FileMode } from '../types/types';

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
    setProjectFile: (file: string, mode: FileMode) => void;
}

export default class Home extends Component<IProps> {
    props: IProps;

    constructor(props, history) {
        super(props);
    }

    toPage(route: string) {
        this.props.history.push(route);
    }

    render() {
        return (
            <div className="home vh-100 f fp-col fp-ycenter fp-xcenter">
                <h1>Scouter Design</h1>
                <Button
                    className="home__button my-1 w-7"
                    type="primary"
                    onClick={() => {
                        remote.dialog.showSaveDialog(
                            {
                                title: 'Test'
                            },
                            filename => {
                                // this.props.ipcInterface.newFile(filename);
                                if (filename) {
                                    let fName = filename;
                                    if (!fName.endsWith(EXTENSION_SDW)) {
                                        fName = fName + EXTENSION_SDW;
                                    }
                                    this.props.setProjectFile(fName, 'w');
                                    this.toPage(routes.DESIGNER);
                                }
                            }
                        );
                    }}
                >
                    New Project
                </Button>
                <Button
                    className="home__button my-1 w-7"
                    type="primary"
                    onClick={() => {
                        remote.dialog.showOpenDialog({}, paths => {
                            if (paths) {
                                this.props.setProjectFile(paths[0], 'r');
                                this.toPage(routes.DESIGNER);
                            }
                        });
                    }}
                >
                    Open Project
                </Button>
            </div>
        );
    }
}
