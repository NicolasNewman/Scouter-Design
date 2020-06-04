import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import DataStore from 'app/classes/DataStore';
import { Button } from 'antd';
import routes from '../constants/routes';

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
}

export default class Home extends Component<IProps> {
    props: IProps;

    constructor(props, history) {
        super(props);
    }

    toPage(route: string, e) {
        this.props.history.push(route);
    }

    render() {
        return (
            <div className="home vh-100 f fp-col fp-ycenter fp-xcenter">
                <h1>Scouter Design</h1>
                <Button
                    className="home__button my-1 w-7"
                    type="primary"
                    onClick={this.toPage.bind(this, routes.DESIGNER)}
                >
                    New Project
                </Button>
                <Button
                    className="home__button my-1 w-7"
                    type="primary"
                    onClick={this.toPage.bind(this, routes.DESIGNER)}
                >
                    Open Project
                </Button>
            </div>
        );
    }
}
