import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Designer from '../components/Designer';
import EventItemActions from '../actions/event';
import StateItemActions from '../actions/state';

function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
        dataStore: ownProps.dataStore,
        events: state.event,
        states: state.state,
        file: state.core.file,
        mode: state.core.mode
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators(
        {
            ...EventItemActions,
            ...StateItemActions
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Designer);
