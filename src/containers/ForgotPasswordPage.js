// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import type { RootState } from '../states';
import type { AuthState } from '../states/auth';
import { forgotPassword } from '../actions/auth';
import Navigation from '../containers/Navigation';
import ForgotPasswordView from '../components/ForgotPassword/ForgotPasswordView';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';
import { injectFooter } from '../utils/utils';

type Props = {
  auth: AuthState,
  actions: {
    forgotPassword: string => void,
    push: string => void,
  },
};

class ForgotPasswordPage extends PureComponent<Props> {
  render() {
    const { auth: { forgotPasswordRequest }, actions } = this.props;
    const viewProps = {
      forgotPasswordRequest,
      ...actions,
    };

    return (
      <div>
        <HTPageTitle translationKey="page.title.forgot_password" />
        <Navigation />
        <ForgotPasswordView {...viewProps} />
      </div>
    );
  }
}

function mapStateToProps({ auth }: RootState) {
  return {
    auth,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = { push, forgotPassword };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectFooter(ForgotPasswordPage)
);
