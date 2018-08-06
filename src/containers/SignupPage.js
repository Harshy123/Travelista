// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { signup, flushPartnerCode } from '../actions/auth';
import type { RootState } from '../states';
import type { AuthState } from '../states/auth';
import type { UserInfo } from '../models/UserInfo.js';
import SignupView from '../components/Signup/SignupView';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';
import Navigation from '../containers/Navigation';
import { goBack } from 'connected-react-router';

type Props = {
  auth: AuthState,
  actions: {
    signup: (string, string, UserInfo) => void,
    flushPartnerCode: () => void,
    goBack: () => void,
  },
};

class SignupPage extends PureComponent<Props> {
  componentWillMount() {
    if (this.props.auth.accessToken != null) {
      this.props.actions.goBack();
    }
  }

  componentWillUnmount() {
    this.props.actions.flushPartnerCode();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.auth.accessToken == null &&
      nextProps.auth.accessToken != null
    ) {
      nextProps.actions.goBack();
    }
  }

  render() {
    const {
      auth: { signupRequest: { error }, signupInfo: { email, partnerCode } },
      actions: { signup },
    } = this.props;

    return (
      <div>
        <HTPageTitle translationKey="page.title.registration" />
        <Navigation renderLeft={false} renderRight={false} />
        <SignupView
          prefilledFields={{
            email,
            partnerCode: partnerCode ? partnerCode : undefined,
          }}
          signup={signup}
          signupError={error}
        />
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
  const actions = {
    signup,
    flushPartnerCode,
    goBack,
  };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
