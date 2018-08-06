// @flow

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import type { RootState } from '../states';
import type { AppState, Context } from '../states/app';
import type { AuthState } from '../states/auth';

import { openAuthModal, closeAuthModal, saveContext } from '../actions/app';
import { verifyRemindToastr } from '../components/VerifyRemindToastr/verifyRemindToaster';

type Props = {
  children?: React.Node,
  to: string,
  isPrivate: boolean,
  app: AppState,
  auth: AuthState,
  actions: {
    openAuthModal: (mode: 'signin' | 'signup') => void,
    closeAuthModal: () => void,
    saveContext: Context => void,
  },
  disabled: boolean,
};

class HTLink extends React.PureComponent<Props> {
  static defaultProps = {
    isPrivate: false,
    disabled: false,
  };

  componentWillUnmount() {
    const {
      app: { authModalConfig },
      actions: { closeAuthModal },
    } = this.props;
    if (authModalConfig.isOpen) {
      closeAuthModal();
    }
  }

  onClick = (e: Event) => {
    const { to, isPrivate, auth: { isLoggedIn, user }, disabled } = this.props;
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (isPrivate && (!isLoggedIn || !user)) {
      e.preventDefault();
      this.props.actions.saveContext({ path: to });
      this.props.actions.openAuthModal('signup');
      return;
    }

    if (isPrivate && user && user.signupCompleted && !user.verified) {
      e.preventDefault();
      verifyRemindToastr(user);
      return;
    }
  };

  render() {
    return (
      <Link to={this.props.to} onClick={this.onClick}>
        {this.props.children}
      </Link>
    );
  }
}

function mapStateToProps({ app, auth }: RootState) {
  return {
    app,
    auth,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = {
    openAuthModal,
    closeAuthModal,
    saveContext,
  };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(HTLink);
