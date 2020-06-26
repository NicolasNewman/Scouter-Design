import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Designer from '../components/Designer';
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

export default connect(mapStateToProps, mapDispatchToProps)(Designer);
