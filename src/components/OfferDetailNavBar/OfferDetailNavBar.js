// @flow

import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';

import greenBackIcon from '../../images/ic_green_back.svg';
import foundation from '../../styles/foundation.scss';

import ExperienceDropDown from '../ExperienceDropdown/ExperienceDropdown';

import styles from './OfferDetailNavBar.scss';

import type { IntlShape } from 'react-intl';

import type { Experience } from '../../models/Experience';
import type { Dispatch } from '../../types/Dispatch';
import type { RootState } from '../../states';

type StateProps = {
  experiences: Experience[],
};

type Props = {
  dispatch: Dispatch,
  intl: IntlShape,
} & StateProps;

class OfferDetailNavBar extends PureComponent<Props> {
  render() {
    const { intl: { formatMessage }, experiences } = this.props;

    return (
      <div
        className={classNames(styles.container, foundation['grid-container'])}
      >
        <ExperienceDropDown
          className={styles.experienceDropDown}
          experiences={experiences}
          experienceId={null}
          onExperienceChange={this.handleExperienceChange}
        />
        <Link to="/all-offers" className={styles.backButton}>
          <img
            src={greenBackIcon}
            alt={formatMessage({ id: 'image.icon.back' })}
            width="30"
            height="30"
          />
        </Link>
      </div>
    );
  }

  handleExperienceChange = (experience: ?Experience) => {
    const { dispatch } = this.props;

    if (experience == null) {
      dispatch(push('/all-offers'));

      return;
    }

    dispatch(push(`/all-offers/${experience.id}`));
  };
}

function mapStateToProps(state: RootState): StateProps {
  return {
    experiences: state.app.experiences,
  };
}

export default connect(mapStateToProps)(injectIntl(OfferDetailNavBar));
