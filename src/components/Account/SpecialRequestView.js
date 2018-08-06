// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import cn from 'classnames';
import { userToUpdateUser } from '../../models/User';
import foundation from '../../styles/foundation.scss';
import { toastrSuccess } from '../../utils/toastr';
import styles from './Account.scss';
import HTButton from '../HTButton/HTButton';

import type { Request } from '../../types/index';
import type { User, UpdateUser } from '../../models/User';

type Props = {
  intl: IntlShape,
  user: User,
  updateProfile: UpdateUser => void,
  updateProfileRequest: Request,
};

type State = {
  form: {
    specialRequest: ?string,
  },
};

class SpecialRequestView extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        specialRequest: props.user.specialRequest,
      },
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const nextError = nextProps.updateProfileRequest.error;
    const thisRequesting = this.props.updateProfileRequest.requesting;
    const nextRequesting = nextProps.updateProfileRequest.requesting;
    const { intl: { formatMessage } } = this.props;
    if (thisRequesting && !nextRequesting && nextError == null) {
      toastrSuccess(
        formatMessage({ id: 'account.tab.special_request.success' })
      );
    }
  }

  render() {
    const {
      intl: { formatMessage },
      updateProfileRequest: { requesting },
    } = this.props;
    const { form: { specialRequest } } = this.state;

    return (
      <div className={styles.specialRequestContainer}>
        <form onReset={this.resetForm} onSubmit={this.onSubmit}>
          <textarea
            className={cn(styles.specialRequestInput, {
              [styles.isDisabled]: requesting,
            })}
            placeholder={formatMessage({
              id: 'account.tab.special_request.placeholder',
            })}
            value={specialRequest}
            onChange={this.onSpecialRequestChange}
            disabled={requesting}
          />
          <div className={styles.specialRequestButtonGroup}>
            <HTButton
              type={'reset'}
              buttonType={'gray'}
              text={formatMessage({ id: 'account.tab.special_request.clear' })}
              className={cn(styles.button, foundation['hide-for-small-only'])}
              isDisabled={requesting}
            />
            <HTButton
              type={'submit'}
              buttonType={'green'}
              text={formatMessage({ id: 'account.tab.special_request.submit' })}
              className={styles.button}
              isDisabled={requesting}
            />
          </div>
        </form>
      </div>
    );
  }

  resetForm = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState((state: State) => ({
      ...state,
      form: {
        specialRequest: '',
      },
    }));
  };

  onSpecialRequestChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const value = e.target.value;

    this.setState((state: State) => ({
      ...state,
      form: {
        ...state.form,
        specialRequest: value,
      },
    }));
  };

  onSubmit = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { user, updateProfile } = this.props;

    updateProfile({
      ...userToUpdateUser(user),
      specialRequest: this.state.form.specialRequest,
    });
  };
}

export default injectIntl(SpecialRequestView);
