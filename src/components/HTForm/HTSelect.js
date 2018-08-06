// @flow
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import { injectIntl } from 'react-intl';

import styles from './HTForm.scss';
import 'react-select/dist/react-select.css';
import '../../styles/third-party.css';
import foundation from '../../styles/foundation.scss';
import dropDownDownIcon from '../../images/ic_green_dropdown_down_thick.svg';
import dropDownUpIcon from '../../images/ic_green_dropdown_up_thick.svg';

import HTText from '../HTText/HTText';

import type { Node } from 'react';
import type { IntlShape } from 'react-intl';
export type Option<T> = {
  value?: ?T,
  label?: string,
};

type Props<T> = {
  intl: IntlShape,
  isError?: boolean,
  isDisabled?: boolean,
  inlineLabel?: boolean,
  className?: string,
  errorMessage?: ?string,
  defaultValue?: ?T,
  renderArrow?: ({ isOpen: boolean }) => Node,
  isOptional?: boolean,
  placeholder?: string,
  placeholderHint?: string,
  options: $ReadOnlyArray<Option<T>>,
  onChange?: (Option<T>) => void,
  searchable?: boolean,
};

type State<T> = {
  label: ?string,
  value: ?T,
};

class HTSelect<T> extends PureComponent<Props<T>, State<T>> {
  static defaultProps = {
    searchable: false,
  };

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      label: null,
      value: null,
    };
  }

  filterOption = (option: Option<T>, filter: string): boolean => {
    const label = option.label;
    if (!label) {
      return false;
    }

    return label.toLowerCase().startsWith(filter.toLowerCase());
  };

  handleChange = (option: Option<T>) => {
    if (!option) {
      return;
    }
    this.setState({
      label: option.label,
      value: option.value,
    });
    if (this.props.onChange) {
      this.props.onChange(option);
    }
  };

  renderArrow = ({ isOpen }: { isOpen: boolean }) => {
    const { intl: { formatMessage } } = this.props;
    return isOpen ? (
      <img
        alt={formatMessage({ id: 'image.dropdown.up' })}
        src={dropDownUpIcon}
        className={styles.dropDownUpIcon}
      />
    ) : (
      <img
        alt={formatMessage({ id: 'image.dropdown.down' })}
        src={dropDownDownIcon}
        className={styles.dropDownDownIcon}
      />
    );
  };

  render() {
    const {
      renderArrow,
      className,
      placeholder,
      placeholderHint,
      isError,
      isDisabled,
      inlineLabel,
      defaultValue,
      searchable,
    } = this.props;

    const selectStyle = classNames(styles.select, className, {
      [styles.error]: isError,
      [styles.inlineLabelSelect]: inlineLabel,
    });
    return (
      <div
        className={classNames(styles.selectWrapper, {
          [styles.disabled]: isDisabled,
          [styles.withPaddingBottom]: isError || placeholderHint ? false : true,
        })}
      >
        {this.renderInlineLabel()}
        <Select
          clearable={false}
          arrowRenderer={renderArrow || this.renderArrow}
          filterOption={searchable ? this.filterOption : undefined}
          searchable={searchable}
          value={defaultValue}
          placeholder={this.state.label || placeholder}
          className={selectStyle}
          optionClassName={styles.option}
          onChange={this.handleChange}
          options={this.props.options}
          menuContainerStyle={{ zIndex: 999 }}
          disabled={isDisabled}
        />
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
            styles.selectLabel,
            foundation['show-for-small-only']
          )}
        >
          {placeholder || ''}
        </div>
      );
    }
  };

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
export default injectIntl(HTSelect);
