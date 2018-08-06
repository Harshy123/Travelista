// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PromoCodeInput from '../components/OfferDetailView/PromoCodeInput';
import type { RootState } from '../states';
import type { PromoCodeState } from '../states/promoCode';
import { fetchPromoCode, flushPromoCode } from '../actions/promoCode';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import debounce from 'debounce';

type Props = {
  intl: IntlShape,
  state: {
    promoCode: PromoCodeState,
  },
  actions: {
    fetchPromoCode: string => void,
    flushPromoCode: () => void,
  },
};

type ViewState = {
  textInput: string,
  debouncing: boolean,
};

class PromoteCodeInputContainer extends PureComponent<Props, ViewState> {
  debouncedFetchPromoCode: string => void;

  constructor(props: Props) {
    super(props);
    const { fetchPromoCode } = props.actions;
    const { state: { promoCode: { code } } } = props;
    this.debouncedFetchPromoCode = debounce(fetchPromoCode, 2000);
    this.state = {
      textInput: code ? code.code : '',
      debouncing: false,
    };
  }
  componentWillReceiveProps(props: Props) {
    if (props.state.promoCode.fetchPromoCodeRequest.requesting) {
      this.setState({ debouncing: false });
    }
  }
  onChange = (code: string) => {
    this.setState(
      {
        textInput: code,
      },
      () => {
        if (code !== '') {
          this.debouncedFetchPromoCode(code);
          this.setState({ debouncing: true });
        } else {
          this.debouncedFetchPromoCode.clear();
          this.setState({ debouncing: false });
          this.props.actions.flushPromoCode();
        }
      }
    );
  };

  onBlur = (code: string) => {
    const { fetchPromoCode } = this.props.actions;
    this.debouncedFetchPromoCode.clear();
    this.setState({ debouncing: false });
    fetchPromoCode(code);
  };

  render() {
    const {
      code,
      fetchPromoCodeRequest: { requesting, error },
    } = this.props.state.promoCode;
    const { intl: { formatMessage } } = this.props;
    const { textInput, debouncing } = this.state;
    const status: 'loading' | 'success' | 'failure' | 'default' =
      textInput === ''
        ? 'default'
        : requesting || debouncing
          ? 'loading'
          : code != null ? 'success' : error != null ? 'failure' : 'default';

    let message = '';

    if (status === 'failure') {
      message = formatMessage({
        id: 'promo_code.failure',
      });
    }
    return (
      <div>
        <PromoCodeInput
          status={status}
          message={message}
          onChange={this.onChange}
          onBlur={this.onBlur}
          value={textInput}
        />
      </div>
    );
  }
}
function mapStateToProps({ promoCode }: RootState) {
  return {
    state: {
      promoCode,
    },
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = { fetchPromoCode, flushPromoCode };
  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(PromoteCodeInputContainer)
);
