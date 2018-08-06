// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { push, replace } from 'connected-react-router';
import { connect } from 'react-redux';

import type { RootState } from '../states';
import type { AuthState } from '../states/auth';
import type { AccountState } from '../states/account';
import type { UpdateUser } from '../models/User';

import { openUpdateCardModal } from '../actions/app';
import { signout } from '../actions/auth';
import {
  updateProfile,
  updateProfilePicture,
  fetchOrders,
} from '../actions/account';

import Navigation from '../containers/Navigation';
import AccountView from '../components/Account/AccountView';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';

import { mustBe, injectFooter } from '../utils/utils';

type Props = {
  auth: AuthState,
  account: AccountState,
  actions: {
    updateProfile: UpdateUser => void,
    updateProfilePicture: File => void,
    fetchOrders: void => void,
    signout: () => void,
    push: string => void,
    replace: string => void,
    openUpdateCardModal: () => void,
  },
};

class AccountPage extends PureComponent<Props> {
  componentWillMount() {
    if (this.props.auth.accessToken === null) {
      this.props.actions.replace('/');
    }
    this.props.actions.fetchOrders();
  }

  render() {
    const { auth: { user }, account, actions } = this.props;

    if (!user) {
      return null;
    }

    const viewProps = {
      user: mustBe(user),
      account,
      ...actions,
    };

    return (
      <div>
        <HTPageTitle translationKey="page.title.account" />
        <Navigation />
        <AccountView {...viewProps} />
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
  const actions = {
    push,
    replace,
    updateProfile,
    updateProfilePicture,
    fetchOrders,
    signout,
    openUpdateCardModal,
  };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectFooter(AccountPage)
);
