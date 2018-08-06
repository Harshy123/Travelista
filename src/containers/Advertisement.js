// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchAdvertisements } from '../actions/advertisement';
import AdvertisementView from '../components/Advertisement/AdvertisementView';

import type { RootState } from '../states';
import type { AdvertisementState } from '../states/advertisement';

type Props = {
  advertisement: AdvertisementState,
  actions: {
    fetchAdvertisements: () => void,
  },
  showTitle: boolean,
  className?: string,
  titleClassName?: string,
};

class Advertisement extends PureComponent<Props> {
  static defaultProps = {
    showTitle: false,
  };

  render() {
    const viewProps = {
      advertisement: this.props.advertisement,
      showTitle: this.props.showTitle,
      className: this.props.className,
      titleClassName: this.props.titleClassName,
      ...this.props.actions,
    };

    return <AdvertisementView {...viewProps} />;
  }
}

function mapStateToProps({ advertisement }: RootState) {
  return {
    advertisement,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = {
    fetchAdvertisements,
  };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(Advertisement);
