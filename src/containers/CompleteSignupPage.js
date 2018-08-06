// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { completeSignup, flushPartnerCode } from '../actions/auth';
import { resumeContext } from '../actions/app';
import type { RootState } from '../states';
import type { AuthState } from '../states/auth';
import type { UserInfo } from '../models/UserInfo';
import SignupView from '../components/Signup/SignupView';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';
import Navigation from '../containers/Navigation';
import { mustBe, injectFooter } from '../utils/utils';
import { goBack } from 'connected-react-router';

type Props = {
  auth: AuthState,
  actions: {
    completeSignup: (string, UserInfo) => void,
    flushPartnerCode: () => void,
    resumeContext: () => void,
    goBack: () => void,
  },
};

class CompleteSignupPage extends PureComponent<Props> {
  componentWillMount() {
    if (this.props.auth.user && this.props.auth.user.signupCompleted) {
      this.props.actions.goBack();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisUser = this.props.auth.user;
    const nextUser = nextProps.auth.user;
    const thisUserSignupCompleted = thisUser ? thisUser.signupCompleted : false;
    const nextUserSignupCompleted = nextUser ? nextUser.signupCompleted : false;
    if (!thisUserSignupCompleted && nextUserSignupCompleted) {
      nextProps.actions.resumeContext();
    }
  }

  componentWillUnmount() {
    this.props.actions.flushPartnerCode();
  }

  render() {
    const {
      auth: {
        completeSignupRequest: { error },
        user,
        signupInfo: { partnerCode },
      },
      actions: { completeSignup },
    } = this.props;

    const user_ = mustBe(user);
    const excludedFields = ['password', 'confirmPassword'];
    if (user_.email) {
      excludedFields.push('email');
    }
    const prefilledFields = {
      firstName: user_.firstName,
      lastName: user_.lastName,
      email: user_.email,
      partnerCode: partnerCode ? partnerCode : undefined,
    };

    return (
      <div>
        <HTPageTitle translationKey={'signup.title'} />
        <Navigation renderLeft={false} renderRight={false} />
        <SignupView
          prefilledFields={prefilledFields}
          excludedFields={excludedFields}
          completeSignup={completeSignup}
          signupError={error}
          userId={user_.id}
          isCompletingSignup
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
    completeSignup,
    flushPartnerCode,
    resumeContext,
    goBack,
  };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectFooter(CompleteSignupPage)
);
