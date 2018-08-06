// @flow
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Navigation from '../containers/Navigation';
import PressView from '../components/Press/PressView';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';

import { fetchPresses } from '../actions/press';

import type { RootState } from '../states';
import type { PressState } from '../states/press';
import type { PressesResponse } from '../types';

type Props = {
  press: PressState,
  actions: {
    fetchPresses: (number, number) => Promise<PressesResponse>,
  },
};

class PressPage extends PureComponent<Props> {
  render() {
    const { press: { fetchPressesRequest, presses }, actions } = this.props;
    const viewProps = {
      request: fetchPressesRequest,
      presses,
      ...actions,
    };
    return (
      <div>
        <HTPageTitle
          translationKey="page.title.press"
          descriptionKey="page.description.press"
        />
        <Navigation />
        <PressView {...viewProps} />
      </div>
    );
  }
}

function mapStateToProps({ press }: RootState) {
  return { press };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = { fetchPresses };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(PressPage);
