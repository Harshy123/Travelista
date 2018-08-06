// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';

import dropdownUpIcon from '../../images/ic_dropdown_up.svg';
import dropdownDownIcon from '../../images/ic_dropdown_down.svg';

import HTSelect from '../HTForm/HTSelect';

import styles from './ExperienceDropdown.scss';

import type { IntlShape } from 'react-intl';
import type { Experience } from '../../models/Experience';
import type { Option } from '../HTForm/HTSelect';

type Props = {
  intl: IntlShape,
  className?: string,
  experiences: Experience[],
  experienceId: ?string,
  onExperienceChange: (?Experience) => void,
};

class ExperienceDropdown extends PureComponent<Props> {
  render() {
    const {
      intl: { formatMessage },
      className,
      experiences,
      experienceId,
    } = this.props;

    if (experiences.length <= 0) {
      return null;
    }

    const options = experiencesToOptions(experiences);

    return (
      <div className={classNames(styles.container, className)}>
        <HTSelect
          renderArrow={this.renderArrow}
          defaultValue={experienceId}
          placeholder={formatMessage({ id: 'offer.view_by_experiences' })}
          options={options}
          className={styles.select}
          onChange={this.handleChange}
        />
      </div>
    );
  }

  renderArrow = ({ isOpen }: { isOpen: boolean }) => {
    const { intl: { formatMessage } } = this.props;
    const icon = isOpen ? (
      <img
        alt={formatMessage({ id: 'image.dropdown.up' })}
        src={dropdownUpIcon}
        className={styles.dropdownIcon}
      />
    ) : (
      <img
        alt={formatMessage({ id: 'image.dropdown.down' })}
        src={dropdownDownIcon}
        className={styles.dropdownIcon}
      />
    );
    return <div className={styles.iconContainer}>{icon}</div>;
  };

  handleChange = (option: Option<string>) => {
    const { experiences, onExperienceChange } = this.props;

    const experienceId = option.value;

    if (experienceId == null) {
      onExperienceChange(null);

      return;
    }

    const experience = experiences.find((ex: Experience) => {
      return ex.id === experienceId;
    });

    onExperienceChange(experience);
  };
}

export default injectIntl(ExperienceDropdown);

function experiencesToOptions(experiences: Experience[]): Option<string>[] {
  const options: Option<string>[] = experiences.map((ex: Experience) => ({
    label: ex.name,
    value: ex.id,
  }));

  return [{ label: 'ALL', value: null }, ...options];
}
