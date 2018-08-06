// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Navigation from './Navigation';
import PartnersView from '../components/Partners/PartnersView';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';
import { fetchHotelGroups } from '../actions/hotelGroup';
import { injectFooter } from '../utils/utils';

import type { RootState } from '../states';
import type { AppState } from '../states/app';
import type { HotelGroupState } from '../states/hotelGroup';

type Props = {
  app: AppState,
  hotelGroup: HotelGroupState,
  actions: {
    fetchHotelGroups: void => void,
  },
};

class PartnersPage extends PureComponent<Props> {
  render() {
    const viewProps = {
      app: this.props.app,
      hotelGroup: this.props.hotelGroup,
      ...this.props.actions,
    };
    return (
      <div>
        <HTPageTitle translationKey="page.title.partners" />
        <Navigation />
        <PartnersView {...viewProps} />
      </div>
    );
  }
}

function mapStateToProps({ app, hotelGroup }: RootState) {
  return {
    app,
    hotelGroup,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = { fetchHotelGroups };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(
  injectFooter(PartnersPage)
);
