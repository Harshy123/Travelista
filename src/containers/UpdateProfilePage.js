// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { push, replace } from 'connected-react-router';
import { connect } from 'react-redux';
import { updateProfile, updateProfilePicture } from '../actions/account';
import type { User } from '../models/User';
import type { RootState } from '../states';
import type { AuthState } from '../states/auth';
import type { AccountState } from '../states/account';
import Navigation from '../containers/Navigation';
import UpdateProfileView from '../components/Account/UpdateProfileView';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';
import { mustBe, injectFooter } from '../utils/utils';

type Props = {
  auth: AuthState,
  account: AccountState,
  actions: {
    push: string => void,
    replace: string => void,
    updateProfile: User => void,
    updateProfilePicture: File => void,
  },
};

class UpdateProfilePage extends PureComponent<Props> {
  componentWillMount() {
    if (this.props.auth.accessToken === null) {
      this.props.actions.replace('/');
    }
  }

  render() {
    const { auth: { user }, account, actions } = this.props;

    if (!user) {
      return null;
    }

    const viewProps = {
      account,
      user: mustBe(user),
      ...actions,
    };

    return (
      <div>
        <HTPageTitle translationKey="page.title.update_profile" />
        <Navigation />
        <UpdateProfileView {...viewProps} />
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
  const actions = { push, replace, updateProfile, updateProfilePicture };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectFooter(UpdateProfilePage)
);
