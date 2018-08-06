// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import qs from 'query-string';
import type { RootState } from '../states';
import type { AuthState } from '../states/auth';
import type { Match } from 'react-router';
import type { Location } from 'react-router';
import { resetPassword } from '../actions/auth';
import Navigation from '../containers/Navigation';
import ResetPasswordView from '../components/ForgotPassword/ResetPasswordView';
import URLInvalidView from '../components/ForgotPassword/URLInvalidView';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';
import { mustBe, injectFooter } from '../utils/utils';

type Props = {
  match: Match,
  location: Location,
  auth: AuthState,
  actions: {
    resetPassword: (string, string, number, string) => void,
    push: string => void,
  },
};

class ResetPasswordPage extends PureComponent<Props> {
  isResetPasswordInfoValid = () => {
    const { userID, code, expireAt } = this.rawResetPasswordInfo();

    if (!userID || !code || !expireAt) {
      return false;
    }

    return true;
  };

  rawResetPasswordInfo = () => {
    const { location: { search }, match } = this.props;
    const queryStrings = qs.parse(search);
    const userID: ?string = match.params.userID;
    const code: ?string = queryStrings.code;
    const expireAt: ?string = queryStrings.expire_at;

    return {
      userID,
      code,
      expireAt,
    };
  };

  formattedResetPasswordInfo = () => {
    const rawResetPasswordInfo = this.rawResetPasswordInfo();

    return {
      userID: mustBe(rawResetPasswordInfo.userID),
      code: mustBe(rawResetPasswordInfo.code),
      expireAt: parseInt(mustBe(rawResetPasswordInfo.expireAt), 10) || 0,
    };
  };

  render() {
    if (!this.isResetPasswordInfoValid()) {
      return <URLInvalidView />;
    }

    const { auth: { resetPasswordRequest }, actions } = this.props;
    const viewProps = {
      resetPasswordRequest,
      resetPasswordInfo: this.formattedResetPasswordInfo(),
      ...actions,
    };

    return (
      <div>
        <HTPageTitle translationKey="page.title.reset_password" />
        <Navigation />
        <ResetPasswordView {...viewProps} />
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
  const actions = { push, resetPassword };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectFooter(ResetPasswordPage)
);
