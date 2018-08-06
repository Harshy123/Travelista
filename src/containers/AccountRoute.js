// @flow

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { replace, goBack } from 'connected-react-router';

import { saveContext } from '../actions/app';

import type { AuthState } from '../states/auth';
import type { Context } from '../states/app';
import type { RootState } from '../states';

type Props = {
  component: React.ComponentType<*>,
  auth: AuthState,
  actions: {
    replace: string => void,
    goBack: () => void,
    saveContext: Context => void,
  },
  location: {
    pathname: string,
  },
};

class AccountRoute extends React.PureComponent<Props> {
  componentWillMount() {
    const {
      auth: { isLoggedIn, user },
      location: { pathname: path },
    } = this.props;
    if (!isLoggedIn || !user) {
      this.props.actions.goBack();
      this.props.actions.saveContext({ path });
      return;
    }
    if (!user.signupCompleted) {
      this.props.actions.replace('/complete_signup');
      this.props.actions.saveContext({ path });
      return;
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    const { auth: { user } } = this.props;

    if (!user || !user.signupCompleted) {
      return null;
    }

    return <Route {...rest} component={Component} />;
  }
}

function mapStateToProps({ auth }: RootState) {
  return {
    auth,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = { replace, goBack, saveContext };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountRoute);
