// @flow

import * as React from 'react';
import { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './HTButton.scss';

type ButtonType =
  | 'black'
  | 'gray'
  | 'green'
  | 'hollow'
  | 'hollowBlack'
  | 'hollowBrown'
  | 'hollowGray'
  | 'hollowChampagne'
  | 'white'
  | 'transparent';

type Props<T> = {
  type?: 'button' | 'submit' | 'reset',
  style?: { [string]: mixed },
  buttonType: ButtonType,
  className?: string,
  contentClassName?: string,
  text?: string,
  isDisabled?: boolean,
  info?: T,
  onClick?: (e: SyntheticInputEvent<HTMLInputElement>, info: ?T) => void,
  children?: React.Node,
};

class HTButton<T> extends PureComponent<Props<T>> {
  static defaultProps = {
    type: 'button',
  };

  onClick = (e: SyntheticInputEvent<HTMLInputElement>) => {
    if (this.props.onClick) {
      this.props.onClick(e, this.props.info);
    }
  };

  render() {
    const {
      type,
      className,
      buttonType,
      contentClassName,
      isDisabled,
      style,
      text,
      children,
    } = this.props;

    const buttonClasses = classNames(className, styles.button, {
      [styles.disabled]: isDisabled,
      [styles.blackButton]: buttonType === 'black',
      [styles.grayButton]: buttonType === 'gray',
      [styles.greenButton]: buttonType === 'green',
      [styles.hollowButton]: buttonType === 'hollow',
      [styles.whiteButton]: buttonType === 'white',
      [styles.hollowGrayButton]: buttonType === 'hollowGray',
      [styles.hollowBlackButton]: buttonType === 'hollowBlack',
      [styles.hollowBrownButton]: buttonType === 'hollowBrown',
      [styles.hollowChampagneButton]: buttonType === 'hollowChampagne',
      [styles.transparentButton]: buttonType === 'transparent',
    });

    const contentClasses = classNames(styles.buttonContent, contentClassName);
    return (
      <button
        style={style}
        type={type}
        className={buttonClasses}
        onClick={this.onClick}
      >
        <div className={contentClasses}>{children ? children : text}</div>
      </button>
    );
  }
}

export default HTButton;
