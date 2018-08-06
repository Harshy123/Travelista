// @flow

import React, { PureComponent } from 'react';
import cn from 'classnames';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

import ProfilePicture from './ProfilePicture';
import MyTripsView from './MyTripsView';
import SpecialRequestView from './SpecialRequestView';
import MyCardView from './MyCardView';
import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import { capitalize } from '../../utils/stringUtil';
import { getFutureOrders, getPastOrders } from '../../reducers/account';
import { COUNTRY_OPTIONS } from '../../utils/options';

import type { IntlShape } from 'react-intl';
import type { User, UpdateUser } from '../../models/User';
import type { AccountState } from '../../states/account';

import logoutIcon from '../../images/ic_account_logout.svg';
import foundation from '../../styles/foundation.scss';
import styles from './Account.scss';

type Props = {
  intl: IntlShape,
  account: AccountState,
  updateProfile: UpdateUser => void,
  updateProfilePicture: File => void,
  signout: () => void,
  push: string => void,
  user: User,
  openUpdateCardModal: () => void,
};

class AccountView extends PureComponent<Props> {
  render() {
    return (
      <div>
        <section className={styles.accountHeader}>
          <div
            className={cn(
              foundation['grid-container'],
              styles.accountHeaderWrapper
            )}
          >
            <h2 className={styles.title}>
              <HTText translationKey={'account.title'} />
            </h2>
            {this.renderSignoutButton()}
          </div>
        </section>

        <section className={cn(foundation['grid-container'], styles.account)}>
          <div className={styles.accountInfo}>
            {this.renderProfilePicture()}
            {this.renderProfile()}
          </div>

          {this.renderActionButtons()}
        </section>

        <section
          className={cn(
            foundation['grid-container'],
            foundation['hide-for-small-only']
          )}
        >
          {this.renderTabs()}
        </section>
      </div>
    );
  }

  renderSignoutButton = () => {
    const { intl: { formatMessage }, signout } = this.props;

    return (
      <button
        className={cn(styles.logoutBtn, foundation['hide-for-small-only'])}
        onClick={signout}
      >
        <img
          src={logoutIcon}
          alt={formatMessage({ id: 'image.icon.logout' })}
        />
        {formatMessage({ id: 'account.logout' }).toUpperCase()}
      </button>
    );
  };

  renderProfilePicture = () => {
    const {
      account: { updateProfilePictureRequest },
      user,
      updateProfilePicture,
    } = this.props;

    return (
      <ProfilePicture
        user={user}
        updateProfilePicture={updateProfilePicture}
        updateProfilePictureRequest={updateProfilePictureRequest}
      />
    );
  };

  renderProfile = () => {
    const {
      user: {
        salutation,
        firstName,
        lastName,
        passportName,
        countryOfResidence,
        email,
        mobileNumber,
        defaultCurrency,
        partnerCode,
      },
    } = this.props;

    return (
      <div className={styles.profile}>
        <div className={styles.profileRow}>
          <div className={styles.profileKey}>
            <HTText translationKey={'account.profile.name'} />
          </div>
          <div className={styles.profileValue}>
            {capitalize(salutation)}. {firstName} {lastName}
          </div>
        </div>
        <div className={styles.profileRow}>
          <div className={styles.profileKey}>
            <HTText translationKey={'account.profile.passport_official_name'} />
          </div>
          <div className={styles.profileValue}>{passportName}</div>
        </div>
        <div className={styles.profileRow}>
          <div className={styles.profileKey}>
            <HTText translationKey={'account.profile.country_of_residence'} />
          </div>
          <div className={styles.profileValue}>
            {
              COUNTRY_OPTIONS.filter(
                (option: { value: string, label: string }) => {
                  return option.value === countryOfResidence;
                }
              )[0].label
            }
          </div>
        </div>
        <div className={styles.profileRow}>
          <div className={styles.profileKey}>
            <HTText translationKey={'account.profile.email'} />
          </div>
          <div className={styles.profileValue}>{email}</div>
        </div>
        <div className={styles.profileRow}>
          <div className={styles.profileKey}>
            <HTText translationKey={'account.profile.mobile'} />
          </div>
          <div className={styles.profileValue}>{mobileNumber}</div>
        </div>
        <div className={styles.profileRow}>
          <div className={styles.profileKey}>
            <HTText translationKey={'account.profile.default_currency'} />
          </div>
          <div className={styles.profileValue}>{defaultCurrency}</div>
        </div>
        {partnerCode ? (
          <div className={styles.profileRow}>
            <div className={styles.profileKey}>
              <HTText translationKey={'account.profile.partner_code'} />
            </div>
            <div className={styles.profileValue}>{partnerCode.code}</div>
          </div>
        ) : null}
      </div>
    );
  };

  renderActionButtons = () => {
    const { intl: { formatMessage }, user, signout } = this.props;

    return [
      <div
        key="desktop-action-buttons"
        className={cn(styles.accountActions, foundation['hide-for-small-only'])}
      >
        <HTButton
          buttonType={'hollowBrown'}
          onClick={this.goto('/account/profile/update')}
          text={formatMessage({
            id: 'account.update_my_profile',
          }).toUpperCase()}
        />
        {!user.isSSO && (
          <HTButton
            buttonType={'hollowBrown'}
            onClick={this.goto('/account/password/update')}
            text={formatMessage({
              id: 'account.update_password',
            }).toUpperCase()}
          />
        )}
      </div>,
      <div
        key="mobile-action-buttons"
        className={cn(
          styles.accountActionsMobile,
          foundation['show-for-small-only']
        )}
      >
        <ul>
          <li>
            <Link to="/account/profile/update">
              <HTText translationKey={'account.update_my_profile'} />
            </Link>
          </li>
          {!user.isSSO && (
            <li>
              <Link to="/account/password/update">
                <HTText translationKey={'account.update_password'} />
              </Link>
            </li>
          )}
          <li>
            <span className={styles.logout} onClick={signout}>
              <HTText translationKey={'account.logout'} />
            </span>
          </li>
        </ul>
      </div>,
    ];
  };

  renderTabs = () => {
    const {
      intl: { formatMessage },
      push,
      user,
      updateProfile,
      account: { updateProfileRequest, fetchOrdersRequest },
      openUpdateCardModal,
    } = this.props;

    const tabPanels = {
      'account.tab.my_trips.future_trips_title': (
        <MyTripsView
          type={'future'}
          push={push}
          request={fetchOrdersRequest}
          trips={getFutureOrders(this.props.account)}
        />
      ),
      'account.tab.my_trips.completed_trips_title': (
        <MyTripsView
          type={'completed'}
          push={push}
          request={fetchOrdersRequest}
          trips={getPastOrders(this.props.account)}
        />
      ),
      'account.tab.special_request': (
        <SpecialRequestView
          user={user}
          updateProfile={updateProfile}
          updateProfileRequest={updateProfileRequest}
        />
      ),
      'account.tab.my_card': (
        <MyCardView
          user={user}
          updateProfile={updateProfile}
          updateProfileRequest={updateProfileRequest}
          openUpdateCardModal={openUpdateCardModal}
        />
      ),
    };

    const tabKeys = Object.keys(tabPanels);

    const tabs = tabKeys.map((tab: string) => (
      <Tab key={tab} className={styles.accountTab}>
        <div className={styles.accountTabContainer}>
          <div className={styles.accountTabName}>
            {formatMessage({ id: tab })}
          </div>
        </div>
      </Tab>
    ));

    const panels = tabKeys.map((tab: string) => (
      <TabPanel className={styles.accountPanel} key={tab}>
        {tabPanels[tab]}
      </TabPanel>
    ));

    return (
      <Tabs
        className={styles.accountTabs}
        selectedTabClassName={styles.accountTabSelected}
        selectedTabPanelClassName={styles.accountPanelSelected}
      >
        <TabList className={styles.accountTabList}>{tabs}</TabList>
        <div className={styles.accountPanels}>{panels}</div>
      </Tabs>
    );
  };

  goto = (dst: string) => () => {
    this.props.push(dst);
  };
}

export default injectIntl(AccountView);
