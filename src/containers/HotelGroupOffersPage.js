// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import HTPageTitle from '../components/HTPageTitle/HTPageTitle';
import Navigation from '../containers/Navigation';
import HotelGroupOffersView from '../components/HotelGroupOffers/HotelGroupOffersView';
import { fetchHotelGroup, fetchOffers } from '../actions/hotelGroup';
import { toastrError } from '../utils/toastr';

import type { Match } from 'react-router';
import type { RootState } from '../states';
import type { HotelGroupState } from '../states/hotelGroup';
import type { HotelGroupResponse } from '../types';

type Props = {
  match: Match,
  hotelGroup: HotelGroupState,
  actions: {
    fetchHotelGroup: string => Promise<HotelGroupResponse>,
    fetchOffers: string => void,
  },
};

class HotelGroupOffersPage extends PureComponent<Props> {
  fetchHotelGroup = (hotelGroupId: string) => {
    const { actions: { fetchHotelGroup } } = this.props;
    fetchHotelGroup(hotelGroupId).catch((error: *) => {
      // TODO: do something when that record is not found
      toastrError(error.message);
    });
  };

  componentWillMount() {
    const hotelGroupSlug = this.props.match.params.slug;
    if (hotelGroupSlug) {
      this.fetchHotelGroup(hotelGroupSlug);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisSlug = this.props.match.params.slug;
    const nextSlug = nextProps.match.params.slug;
    if (thisSlug !== nextSlug && nextSlug) {
      this.fetchHotelGroup(nextSlug);
    }
  }

  render() {
    const {
      hotelGroup: { hotelGroup, offerListItems, fetchOffersRequest },
      actions: { fetchOffers },
    } = this.props;
    if (!hotelGroup) {
      return null;
    }
    return (
      <div>
        <HTPageTitle
          translationKey="page.title.hotel_group_offers"
          values={{ hotel_group: hotelGroup.name }}
          descriptionKey="page.description.hotel_group_offers"
        />
        <Navigation />
        <HotelGroupOffersView
          hotelGroup={hotelGroup}
          offers={offerListItems}
          request={fetchOffersRequest}
          fetchOffers={fetchOffers}
        />
      </div>
    );
  }
}

function mapStateToProps({ hotelGroup }: RootState) {
  return {
    hotelGroup,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = { fetchHotelGroup, fetchOffers };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  HotelGroupOffersPage
);
