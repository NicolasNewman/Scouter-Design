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
            <div className="home">
                <Button
                    className="home__button"
                    type="default"
                    onClick={this.toPage.bind(this, routes.DESIGNER)}
                >
                    <p>New Project</p>
                </Button>
                <Button
                    className="home__button"
                    type="default"
                    onClick={this.toPage.bind(this, routes.DESIGNER)}
                >
                    <p>Open Project</p>
                </Button>
            </div>
        );
    }
}
