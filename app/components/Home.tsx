import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import DataStore from 'app/classes/DataStore';

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
}

export default class Home extends Component<IProps> {
    props: IProps;

    constructor(props) {
        super(props);
    }

    tabChanged = key => {
        console.log(key);
    };

    render() {
        return (
            <div className="home">
                <p>Home</p>
            </div>
        );
    }
}
