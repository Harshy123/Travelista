// @flow

import React, { PureComponent } from 'react';
import type { Node } from 'react';
import styles from './HTAccordion.scss';
import upIcon from '../../images/ic_green_dropdown_up.svg';
import downIcon from '../../images/ic_green_dropdown_down.svg';
import HTImage from '../HTImage/HTImage';
import cn from 'classnames';
type Props = {
  isOpen: boolean,
  title: string,
  children: ?Node,
  className?: string,
  onClickTitle: () => void,
};

class HTAccordion extends PureComponent<Props> {
  render() {
    const { children, isOpen, title, className, onClickTitle } = this.props;
    const contentStyle = cn({
      [styles.opened]: isOpen,
      [styles.closed]: !isOpen,
    });

    return (
      <div className={className}>
        <button className={styles.label} onClick={onClickTitle}>
          <span>{title}</span>
          <div className={styles.iconContainer}>
            <HTImage
              className={styles.icon}
              objectFit={'fill'}
              src={isOpen ? upIcon : downIcon}
              alt={isOpen ? 'upIcon' : 'downIcon'}
            />
          </div>
        </button>
        <div className={contentStyle}>{children}</div>
      </div>
    );
  }
}

export default HTAccordion;
