import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Home from '../components/Home';
import CoreActions from '../actions/core';

function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
        dataStore: ownProps.dataStore
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators(
        {
            ...CoreActions
        },
        dispatch
    );
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Home)
);
