// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { RootState } from '../states';
import type { AuthState } from '../states/auth';
import type { AppState } from '../states/app';
import { setSideMenuState } from '../actions/app';
import HTHeader from '../components/HTHeader/HTHeader';
import { openAuthModal, changeCurrency } from '../actions/app';

type Props = {
  auth: AuthState,
  app: AppState,
  transparent: boolean,
  renderLeft: boolean,
  renderRight: boolean,
  hideAuthLinks: boolean,
  actions: {
    setSideMenuState: (isOpen: boolean) => void,
    openAuthModal: ('signin' | 'signup') => void,
    changeCurrency: (currency: string) => void,
  },
};

class Navigation extends PureComponent<Props> {
  static defaultProps = {
    transparent: false,
    renderLeft: true,
    renderRight: true,
    hideAuthLinks: false,
  };

  render() {
    const viewProps = {
      transparent: this.props.transparent,
      renderLeft: this.props.renderLeft,
      renderRight: this.props.renderRight,
      user: this.props.auth.user,
      appConfig: this.props.app.config,
      hideAuthLinks: this.props.hideAuthLinks,
      ...this.props.actions,
    };
    return <HTHeader {...viewProps} />;
  }
}

function mapStateToProps({ auth, app }: RootState) {
  return {
    auth,
    app,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = {
    setSideMenuState,
    openAuthModal,
    changeCurrency,
  };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
