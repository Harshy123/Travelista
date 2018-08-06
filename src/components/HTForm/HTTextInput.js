// @flow
import React, { PureComponent } from 'react';
import type { Node } from 'react';
import classNames from 'classnames';
import foundation from '../../styles/foundation.scss';
import styles from './HTForm.scss';
import HTText from '../HTText/HTText';
type Props = {
  type: 'text' | 'password',
  isError?: boolean,
  inlineLabel?: boolean,
  errorMessage?: ?string,
  defaultValue?: string,
  className?: string,
  wrapperClassName?: string,
  placeholder?: string,
  placeholderHint?: ?string,
  leadingNode?: Node,
  trailingNode?: Node,
  isOptional?: boolean,
  onChange?: string => void,
  onBlur?: string => void,
  isDisabled: boolean,
  value?: string,
};

class HTTextInput extends PureComponent<Props> {
  static defaultProps = {
    type: 'text',
    isDisabled: false,
  };
  onTextChange = ({ target }: SyntheticInputEvent<HTMLInputElement>) => {
    if (this.props.onChange) this.props.onChange(target.value);
  };

  onTextBlur = ({ target }: SyntheticInputEvent<HTMLInputElement>) => {
    if (this.props.onBlur) this.props.onBlur(target.value);
  };

  render() {
    const {
      leadingNode,
      trailingNode,
      type,
      isError,
      placeholder,
      placeholderHint,
      defaultValue,
      isDisabled,
      wrapperClassName,
      inlineLabel,
      value,
      isOptional,
    } = this.props;

    return (
      <div
        className={classNames(styles.textInputContainer, this.props.className, {
          [styles.withPaddingBottom]:
            isOptional || isError || placeholderHint ? false : true,
        })}
      >
        <div
          className={classNames(wrapperClassName, styles.textWithHint, {
            [styles.error]: isError,
            [styles.disabled]: isDisabled,
            [styles.inlineLabelInput]: inlineLabel,
          })}
        >
          {this.renderInlineLabel()}
          {leadingNode}
          <input
            type={type}
            onChange={this.onTextChange}
            onBlur={this.onTextBlur}
            className={styles.textInput}
            placeholder={placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            value={value}
          />
          {trailingNode}
        </div>
        <div className={styles.optionalAndError}>
          {placeholderHint
            ? this.renderPlaceholderHint(placeholderHint)
            : this.props.isOptional && this.renderOptional()}
          {this.props.errorMessage && this.renderError()}
        </div>
      </div>
    );
  }

  renderInlineLabel = () => {
    const { inlineLabel, placeholder } = this.props;
    if (inlineLabel) {
      return (
        <div
          className={classNames(
            styles.label,
            foundation['show-for-small-only']
          )}
        >
          {placeholder || ''}
        </div>
      );
    }
  };

  renderHint() {
    const { trailingNode } = this.props;
    return trailingNode;
  }

  renderError = () => {
    const { errorMessage } = this.props;
    return <div className={styles.errorMessage}>{errorMessage || ''}</div>;
  };

  renderOptional = () => {
    return (
      <div className={styles.optional}>
        <HTText translationKey={'form.optional'} />
      </div>
    );
  };

  renderPlaceholderHint = (hint: string) => {
    return <div className={styles.optional}>{hint}</div>;
  };
}

export default HTTextInput;
