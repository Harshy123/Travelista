// @flow
import React, { PureComponent } from 'react';
import cn from 'classnames';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import HTText from '../../components/HTText/HTText';

import styles from './HTDateInput.scss';
import './HTDateInput.css';

type Props = {
  placeholder?: string,
  containerClassName?: string,
  onChange: (?Date) => void,
  isOptional?: boolean,
  value?: Date,
  disabledDays?: { before: Date } | { after: Date } | { from: Date, to: Date },
};

type State = {
  selectedDay: ?Date,
};

class HTDateInput extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedDay: this.props.value || null,
    };
  }

  handleDayChange = (selectedDay: Date) => {
    this.setState({
      selectedDay,
    });
    this.props.onChange(selectedDay);
  };

  render() {
    const { placeholder, containerClassName, disabledDays } = this.props;
    const { selectedDay } = this.state;
    return (
      <div className={styles.dateInputContainer}>
        <DayPickerInput
          value={selectedDay || ''}
          classNames={{
            container: cn(styles.dayPickerInput, containerClassName),
            overlayWrapper: 'DayPickerInput-OverlayWrapper',
            overlay: cn('DayPickerInput-Overlay', 'ht-date-input'),
          }}
          onDayChange={this.handleDayChange}
          placeholder={placeholder}
          dayPickerProps={{
            selectedDays: selectedDay,
            disabledDays,
          }}
          inputProps={{ readOnly: true }}
        />
        <div className={styles.optionalAndError}>
          {this.props.isOptional && this.renderOptional()}
        </div>
      </div>
    );
  }

  renderOptional = () => {
    return (
      <div className={styles.optional}>
        <HTText translationKey={'form.optional'} />
      </div>
    );
  };
}

export default HTDateInput;
