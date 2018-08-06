// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import type { IntlShape } from 'react-intl';
import type { Request } from '../../types/index';
import type { User } from '../../models/User';

import { checkFileType } from '../../utils/utils';
import { toastrError } from '../../utils/toastr';
import styles from './Account.scss';

type Props = {
  intl: IntlShape,
  updateProfilePictureRequest: Request,
  updateProfilePicture: File => void,
  className?: string,
  user: ?User,
};

class ProfilePicture extends PureComponent<Props> {
  render() {
    const {
      intl: { formatMessage },
      className,
      updateProfilePictureRequest: { requesting },
    } = this.props;
    return (
      <div className={classNames(className, styles.profilePictureWrapper)}>
        <div
          className={classNames(styles.profilePicture, {
            [styles.processing]: requesting,
          })}
        >
          {this.renderProfilePicture()}
        </div>
        <div className={styles.changeProfilePicture}>
          <label htmlFor="file">
            {formatMessage({ id: 'account.update_profile_picture' })}
          </label>
          <input
            className={styles.fileUpload}
            type="file"
            id="file"
            accept="image/*"
            onChange={this.onFileUploadChange}
            disabled={requesting}
          />
        </div>
      </div>
    );
  }

  renderProfilePicture = () => {
    const { user } = this.props;

    if (user) {
      const { profilePicture, firstName } = user;

      if (profilePicture) {
        return <img src={profilePicture} alt={firstName} />;
      }

      return <span>{firstName[0].toUpperCase()}</span>;
    }
  };

  onFileUploadChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { updateProfilePicture, intl: { formatMessage } } = this.props;
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    checkFileType(file).then((fileType: string) => {
      if (fileType.split('/')[0] !== 'image') {
        toastrError(formatMessage({ id: 'account.profile.picture.not_image' }));
        return;
      }
      updateProfilePicture(file);
    });
  };
}

export default injectIntl(ProfilePicture);
