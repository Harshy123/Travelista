// @flow

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { RootState } from '../states';
import type { AppState } from '../states/app';

import { commaSeparate } from '../utils/stringUtil';

type Props = {
  app: AppState,
  value: number,
  currency?: string,
  style?: { [string]: mixed },
  className?: string,
  currencyClassName?: string,
  valueClassName?: string,
  roundTo8?: boolean,
};

class HTCurrency extends React.Component<Props> {
  static defaultProps = {
    roundTo8: false,
  };

  formatValue = () => {
    const { value } = this.props;

    if (value === 0) {
      return 0;
    }
    // Round to 2dp first to avoid floating point problem e.g 18.000000001
    const roundedValue = Math.round(value * 100) / 100;
    let finalValue = roundedValue;
    if (this.props.roundTo8) {
      const intValue = Math.floor(roundedValue / 10) * 10;
      const result = intValue + 8;
      finalValue = roundedValue < result ? result : result + 10;
    } else {
      finalValue = Math.ceil(roundedValue);
    }
    return commaSeparate(finalValue);
  };

  shouldComponentUpdate(nextProps: Props) {
    const thisCurrency = this.props.app.config.currency;
    const nextCurrency = nextProps.app.config.currency;
    return thisCurrency === nextCurrency;
  }

  render() {
    const {
      app: { config },
      style,
      className,
      currencyClassName,
      valueClassName,
    } = this.props;
    const currency = this.props.currency || config.currency;
    return (
      <span style={style} className={className}>
        <span className={currencyClassName}>{currency}</span>&nbsp;
        <span className={valueClassName}>{this.formatValue()}</span>
      </span>
    );
  }
}

function mapStateToProps({ app }: RootState) {
  return {
    app,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = {};

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(HTCurrency);
