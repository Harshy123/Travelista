// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { push, replace } from 'connected-react-router';
import { connect } from 'react-redux';
import { updatePassword } from '../actions/account';
import type { RootState } from '../states';
import type { AuthState } from '../states/auth';
import type { AccountState } from '../states/account';
import Navigation from '../containers/Navigation';
import UpdatePasswordView from '../components/Account/UpdatePasswordView';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';

type Props = {
  auth: AuthState,
  account: AccountState,
  actions: {
    push: string => void,
    replace: string => void,
    updatePassword: (string, string) => void,
  },
};

class UpdatePasswordPage extends PureComponent<Props> {
  componentWillMount() {
    if (this.props.auth.accessToken === null) {
      this.props.actions.replace('/');
    }
  }

  render() {
    const { account, actions } = this.props;
    const viewProps = {
      account,
      ...actions,
    };

    return (
      <div>
        {' '}
        <HTPageTitle />
        <Navigation />
        <UpdatePasswordView {...viewProps} />
      </div>
    );
  }
}

function mapStateToProps({ auth, account }: RootState) {
  return {
    auth,
    account,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = { push, replace, updatePassword };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePasswordPage);
