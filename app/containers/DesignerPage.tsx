import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Designer from '../components/Designer';
import EventItemActions from '../actions/event';
import StateItemActions from '../actions/state';
import GroupActions from '../actions/group';
import FormActions from '../actions/form';
import GameActions from '../actions/game';

function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
        dataStore: ownProps.dataStore,
        gameProperties: state.game.gameProperties,
        events: state.event,
        states: state.state,
        groups: state.group,
        file: state.core.file,
        mode: state.core.mode,
        formLayout: state.form.formLayout
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators(
        {
            ...EventItemActions,
            ...StateItemActions,
            ...GroupActions,
            ...FormActions,
            ...GameActions
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Designer);
