// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import HomeView from '../components/Home/HomeView';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';
import { openAuthModal } from '../actions/app';
import { fetchHotelGroups } from '../actions/hotelGroup';
import { fetchAdvertisements } from '../actions/advertisement';
import { injectFooter } from '../utils/utils';

import type { RouterHistory, Match } from 'react-router-dom';
import type { RootState } from '../states';
import type { AuthState } from '../states/auth';
import type { AppState } from '../states/app';
import type { HotelGroupState } from '../states/hotelGroup';
import type { AdvertisementState } from '../states/advertisement';

type Props = {
  auth: AuthState,
  app: AppState,
  hotelGroup: HotelGroupState,
  advertisement: AdvertisementState,
  history: RouterHistory,
  match: Match,
  actions: {
    openAuthModal: ('signin' | 'signup') => void,
    push: string => void,
    fetchHotelGroups: void => void,
    fetchAdvertisements: (number, number, 'landing' | 'footer') => void,
  },
};

class HomePage extends PureComponent<Props> {
  render() {
    const viewProps = {
      app: this.props.app,
      hotelGroup: this.props.hotelGroup,
      advertisement: this.props.advertisement,
      isLoggedIn: this.props.auth.isLoggedIn,
      history: this.props.history,
      match: this.props.match,
      ...this.props.actions,
    };
    return (
      <div>
        <HTPageTitle descriptionKey="page.description.home" />
        <HomeView {...viewProps} />
      </div>
    );
  }
}

function mapStateToProps({ app, auth, hotelGroup, advertisement }: RootState) {
  return {
    app,
    auth,
    hotelGroup,
    advertisement,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = {
    openAuthModal,
    push,
    fetchHotelGroups,
    fetchAdvertisements,
  };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(
  injectFooter(HomePage)
);
