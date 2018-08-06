// @flow

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import HTText from '../HTText/HTText';
import styles from './UserInfoBar.scss';

type Props = {
  profilePicture: ?string,
  name: string,
  large: boolean,
};

class UserInfoBar extends PureComponent<Props> {
  static defaultProps = {
    large: false,
  };

  render() {
    const { name, large } = this.props;

    return (
      <div
        className={classNames(styles.userInfoBar, {
          [styles.largeUserInfoBar]: large,
        })}
      >
        <Link to="/account" className={styles.accountLink}>
          <div className={styles.profilePicture}>
            {this.renderProfilePicture()}
          </div>
          <div className={styles.greeting}>
            <HTText
              translationKey="header.user_info.greeting"
              values={{ name }}
            />
          </div>
        </Link>
      </div>
    );
  }

  renderProfilePicture = () => {
    const { profilePicture, name } = this.props;

    if (profilePicture) {
      return <img src={profilePicture} alt={name} />;
    }

    return <span>{name[0] ? name[0].toUpperCase() : ''}</span>;
  };
}

export default UserInfoBar;
