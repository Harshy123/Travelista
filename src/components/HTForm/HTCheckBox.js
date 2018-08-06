// @flow
import React, { PureComponent } from 'react';
import styles from './HTCheckBox.scss';

type Props = {
  defaultChecked?: boolean,
  value?: boolean,
  onChange?: boolean => void,
  id?: string,
};

class HTCheckBox extends PureComponent<Props> {
  render() {
    const { defaultChecked, value, id } = this.props;
    return (
      <div className={styles.checkboxContainer}>
        <div className={styles.round}>
          <input
            type="checkbox"
            id={id}
            onChange={this.onChange}
            defaultChecked={defaultChecked}
            checked={value}
          />
          <label htmlFor={id} />
        </div>
      </div>
    );
  }

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    if (onChange != null) {
      const { target: { checked } } = e;
      onChange(checked);
    }
  };
}

export default HTCheckBox;
