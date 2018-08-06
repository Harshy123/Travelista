// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import Navigation from '../containers/Navigation';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';
import OffersView from '../components/Offers/OffersView';
import { fetchOffers, flushOffers } from '../actions/offer';

import type { Match } from 'react-router-dom';

import type { Experience } from '../models/Experience';
import type { AppState } from '../states/app';
import type { OfferState } from '../states/offer';
import type { RootState } from '../states';

type Props = {
  app: AppState,
  offer: OfferState,
  match: Match,
  actions: {
    push: string => void,
    fetchOffers: (number, number, ?string) => void,
    flushOffers: () => void,
  },
};

class OffersPage extends PureComponent<Props> {
  componentWillMount() {
    const { actions: { flushOffers } } = this.props;
    flushOffers();
  }

  render() {
    const {
      app: { experiences },
      offer: { offersPageInfo, fetchOffersRequest, offerListItems },
      match,
      actions: { push, fetchOffers, flushOffers },
    } = this.props;

    const filterExperienceId: ?string = match.params.experienceId;
    const selectedExperience = experiences.find((exp: Experience) => {
      return exp.id === filterExperienceId;
    });

    return (
      <div>
        <HTPageTitle
          translationKey="page.title.offers"
          values={{
            experience: selectedExperience ? selectedExperience.name : 'All',
          }}
          descriptionKey="page.description.offers"
        />
        <Navigation />
        <OffersView
          filterExperienceId={filterExperienceId}
          experiences={experiences}
          push={push}
          offers={offerListItems}
          request={fetchOffersRequest}
          fetchOffers={fetchOffers}
          flushOffers={flushOffers}
          pageInfo={offersPageInfo}
        />
      </div>
    );
  }
}

function mapStateToProps({ app, offer, router }: RootState) {
  return {
    app,
    offer,
    router,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = { fetchOffers, flushOffers, push };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(OffersPage);
