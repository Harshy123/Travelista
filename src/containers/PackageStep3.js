// @flow

import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { replace } from 'connected-react-router';
import { injectIntl } from 'react-intl';

import type { IntlShape } from 'react-intl';
import type { Match } from 'react-router';
import type { RootState } from '../states';
import type { User } from '../models/User';
import type { Request, ApiError } from '../types';
import type { Order } from '../models/Order';

import Navigation from './Navigation';
import Advertisement from './Advertisement';
import PackageStep3View from '../components/PackageStep3View/PackageStep3View';
import HTLoadingPage from '../components/HTLoadingPage/HTLoadingPage';
import EmailShareModal from '../components/EmailShareModal/EmailShareModal';
import HTPageTitle from '../components/HTPageTitle/HTPageTitle';
import HTFooter from '../components/HTFooter/HTFooter';
import ShareModal from '../components/ShareModal/ShareModal';
import { generateOfferLink } from '../models/Offer';

import apiClient from '../api';
import { toastrError, toastrSuccess, toastrInfo } from '../utils/toastr';
import { mustBe } from '../utils/utils';

import { fetchOrder } from '../actions/order';

type Props = {
  intl: IntlShape,
  match: Match,
  order: ?Order,
  user: User,
  isLoggedIn: boolean,
  fetchOrder: string => void,
  fetchOrderRequest: Request,
  replace: string => void,
};

type LocalState = {
  sendInvoiceRequest: Request,
  sendConfirmationRequest: Request,
  isShareModalOpen: boolean,
  isEmailInvoiceModalOpen: boolean,
  isEmailConfirmationModalOpen: boolean,
};

class PackageStep3 extends PureComponent<Props, LocalState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sendInvoiceRequest: {
        requesting: false,
        error: null,
      },
      sendConfirmationRequest: {
        requesting: false,
        error: null,
      },
      isShareModalOpen: false,
      isEmailInvoiceModalOpen: false,
      isEmailConfirmationModalOpen: false,
    };
  }

  componentWillMount() {
    const { order, fetchOrder, replace, match } = this.props;
    const orderId = match.params.id;
    if (orderId == null) {
      replace('/');
      return;
    }
    if (order == null || order.id !== orderId) {
      fetchOrder(orderId);
    }
  }

  componentWillUpdate(nextProps: Props, nextState: LocalState) {
    const {
      sendInvoiceRequest: newSendInvoiceRequest,
      sendConfirmationRequest: newSendConfirmationRequest,
    } = nextState;
    const {
      sendInvoiceRequest: originalSendInvoiceRequest,
      sendConfirmationRequest: originalSendConfirmationRequest,
    } = this.state;
    const { intl: { formatMessage }, replace } = this.props;
    if (!originalSendInvoiceRequest.error && newSendInvoiceRequest.error) {
      toastrError(newSendInvoiceRequest.error);
    } else if (
      originalSendInvoiceRequest.requesting &&
      !newSendInvoiceRequest.requesting
    ) {
      toastrInfo(formatMessage({ id: 'packages.step3.send_invoice.success' }));
    }

    if (
      !originalSendConfirmationRequest.error &&
      newSendConfirmationRequest.error
    ) {
      toastrError(newSendConfirmationRequest.error);
    } else if (
      originalSendConfirmationRequest.requesting &&
      !newSendConfirmationRequest.requesting
    ) {
      toastrSuccess(
        formatMessage({ id: 'packages.step3.send_confirmation.success' })
      );
    }

    const { fetchOrderRequest: { error: fetchOrderError } } = nextProps;
    if (fetchOrderError) {
      toastrError(formatMessage({ id: fetchOrderError }));
      replace('/');
    }
  }

  sendInvoice = (emails: string[], message: string) => {
    const { order, intl: { formatMessage } } = this.props;
    const { id } = mustBe(order);
    this.setState({ sendInvoiceRequest: { requesting: true, error: null } });
    apiClient
      .sendOrderInvoice(id, emails, message)
      .then(() => {
        this.setState({
          isEmailInvoiceModalOpen: false,
          sendInvoiceRequest: { requesting: false, error: null },
        });
      })
      .catch((error: ApiError) => {
        this.setState({
          sendInvoiceRequest: {
            requesting: false,
            error: formatMessage({ id: 'packages.step3.send_invoice.error' }),
          },
        });
      });
  };

  sendConfirmation = (emails: string[], message: string) => {
    const { order, intl: { formatMessage } } = this.props;
    const { id } = mustBe(order);
    this.setState({
      sendConfirmationRequest: { requesting: true, error: null },
    });
    apiClient
      .sendBookingConfirmation(id, emails, message)
      .then(() => {
        this.setState({
          isShareModalOpen: false,
          isEmailConfirmationModalOpen: false,
          sendConfirmationRequest: { requesting: false, error: null },
        });
      })
      .catch((error: ApiError) => {
        this.setState({
          sendConfirmationRequest: {
            requesting: false,
            error: formatMessage({
              id: 'packages.step3.send_confirmation.error',
            }),
          },
        });
      });
  };

  printInvoice = () => {
    const { order, isLoggedIn, user } = this.props;
    const { id } = mustBe(order);
    window.open(
      `${process.env.HT_SKYGEAR_ENDPOINT || ''}/order/invoice?order_id=${id}${
        isLoggedIn ? `&user_id=${user.id}` : ''
      }`
    );
  };

  modalSwitch = (openKey: string) => (mode: 'close' | 'open') => () => {
    if (mode === 'close') {
      this.setState({ [openKey]: false });
      return;
    }

    this.setState({ [openKey]: true });
  };

  render() {
    const {
      order,
      user,
      isLoggedIn,
      intl,
      fetchOrderRequest: { requesting: fetchOrderRequesting },
    } = this.props;

    const {
      isShareModalOpen,
      isEmailInvoiceModalOpen,
      isEmailConfirmationModalOpen,
    } = this.state;

    const { formatMessage } = intl;

    if (fetchOrderRequesting || !order) {
      return <HTLoadingPage />;
    }

    return (
      <Fragment>
        <HTPageTitle
          translationKey="page.title.booking_step_3"
          values={{ hotel: order.hotel.name }}
        />
        <Navigation />
        <PackageStep3View
          intl={intl}
          order={order}
          user={user}
          isLoggedIn={isLoggedIn}
          printInvoice={this.printInvoice}
          openShareModal={this.modalSwitch('isShareModalOpen')('open')}
          openEmailShareInvoiceModal={this.modalSwitch(
            'isEmailInvoiceModalOpen'
          )('open')}
          sendInvoiceRequest={this.state.sendInvoiceRequest}
          sendConfirmationRequest={this.state.sendConfirmationRequest}
        />
        <Advertisement />
        <ShareModal
          facebookShareLink={generateOfferLink(order.hotel.slug, order.offerId)}
          isOpen={isShareModalOpen}
          onClose={this.modalSwitch('isShareModalOpen')('close')}
          onShareToEmailClick={this.modalSwitch('isEmailConfirmationModalOpen')(
            'open'
          )}
        />
        <EmailShareModal
          isOpen={isEmailConfirmationModalOpen}
          closeModal={this.modalSwitch('isEmailConfirmationModalOpen')('close')}
          title={formatMessage({ id: 'email_share_modal.confirmation.title' })}
          onSend={this.sendConfirmation}
        />
        <EmailShareModal
          isOpen={isEmailInvoiceModalOpen}
          closeModal={this.modalSwitch('isEmailInvoiceModalOpen')('close')}
          title={formatMessage({ id: 'email_share_modal.invoice.title' })}
          onSend={this.sendInvoice}
          prefilledEmails={user ? [user.email] : undefined}
        />
        <HTFooter />
      </Fragment>
    );
  }
}

function mapStateToProps({ auth, order }: RootState) {
  const { order: order_, fetchOrderRequest } = order;
  const { isLoggedIn, user } = auth;
  return {
    order: order_,
    fetchOrderRequest,
    isLoggedIn,
    user,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = { replace, fetchOrder };
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(PackageStep3)
);
