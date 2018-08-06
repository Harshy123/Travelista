// @flow

import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styles from './PackageStep3View.scss';
import foundation from '../../styles/foundation.scss';
import cn from 'classnames';
import { htmlLineBreak } from '../../utils/stringUtil';
import { SOCIAL_MEDIA_URL, LICENSE_NUM } from '../../utils/constants';

import type { IntlShape } from 'react-intl';
import type { Order, OrderTravelista } from '../../models/Order';
import type { User } from '../../models/User';
import type { Request } from '../../types';

import HTImage from '../HTImage/HTImage';
import HTButton from '../HTButton/HTButton';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';
import HTText from '../HTText/HTText';
import HTMLComponent from '../HTMLComponent/HTMLComponent';
import HTCurrency from '../../containers/HTCurrency';

import bookingConfirmedIcon from '../../images/ic_booking_confirmed.svg';
import igIcon from '../../images/ic_ig_gray.svg';
import fbIcon from '../../images/ic_fb_gray.svg';
import ytIcon from '../../images/ic_yt_gray.svg';
import piIcon from '../../images/ic_pin_gray.svg';
import gpIcon from '../../images/ic_gp_gray.svg';
import twIcon from '../../images/ic_twit_gray.svg';
import logoTAR from '../../images/logo_tar_black.svg';
import logoTIC from '../../images/logo_tic_black.svg';
import logoHATA from '../../images/logo_hata.svg';

const durationDateFormat = 'DD MMM YYYY';
const flightDateFormat = 'DD/MM/YY';

type Props = {
  intl: IntlShape,
  order: Order,
  user: User,
  isLoggedIn: boolean,
  printInvoice: () => void,
  sendInvoiceRequest: Request,
  sendConfirmationRequest: Request,
  openEmailShareInvoiceModal: () => void,
  openShareModal: () => void,
};

class PackageStep3View extends PureComponent<Props> {
  calendarLink = () => {
    const { order: { id } } = this.props;
    return `${process.env.HT_SKYGEAR_ENDPOINT ||
      ''}/order/calendar?order_id=${id}`;
  };

  capacityText = () => {
    const { intl: { formatMessage } } = this.props;
    const { capacity: { adults, children, infants } } = this.props.order;
    let text = '';
    if (adults > 0) {
      text += formatMessage(
        {
          id: 'packages.step3.num_adults',
        },
        { num: adults }
      );
    }
    if (children > 0) {
      text += formatMessage(
        {
          id: 'packages.step3.num_children',
        },
        { num: children }
      );
    }
    if (infants > 0) {
      text += formatMessage(
        {
          id: 'packages.step3.num_infants',
        },
        { num: infants }
      );
    }
    return text;
  };

  renderDetails = () => {
    const {
      intl: { formatMessage },
      isLoggedIn,
      user,
      sendInvoiceRequest,
      sendConfirmationRequest,
    } = this.props;
    const {
      from,
      to,
      bookingDate,
      creditCard,
      capacity,
      package: p,
      hotel,
      currency,
      price,
      userId,
      refNumber,
    } = this.props.order;
    const { roomType } = p;
    const nightCounts = to.startOf('day').diff(from.startOf('day'), 'days');
    return (
      <section className={styles.bookingDetailContainer}>
        <div className={foundation['grid-container']}>
          <div className={cn(foundation['grid-x'], styles.alignCenter)}>
            <div className={foundation['medium-7']}>
              <div className={styles.bookingDetailTitle}>
                <HTText translationKey="packages.step3.summary" />
              </div>
              <div className={styles.summaryContainer}>
                <table className={styles.generalInfo}>
                  <tbody>
                    <tr>
                      <td className={styles.infoTitle}>
                        <HTText translationKey="packages.step3.ref_num" />
                      </td>
                      <td className={styles.infoDetail}>{refNumber}</td>
                    </tr>
                    <tr className={styles.firstRow}>
                      <td className={styles.infoTitle} colSpan="2">
                        {hotel.name}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.infoTitle} colSpan="2">
                        {hotel.address}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.infoTitle} colSpan="2">
                        {hotel.phoneNumber}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.infoTitle} colSpan="2">
                        <a
                          target="_blank"
                          href={`https://www.google.com/maps/search/?api=1&query=${
                            hotel.location.lat
                          },${hotel.location.lng}`}
                        >
                          <HTText translationKey="packages.step3.hotel.map_link" />
                        </a>
                      </td>
                    </tr>
                    <tr className={styles.firstRow}>
                      <td className={styles.infoTitle}>
                        <HTText translationKey="packages.step3.check_in_date" />
                      </td>
                      <td className={styles.infoDetail}>
                        {from.format(durationDateFormat)}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.infoTitle}>
                        <HTText translationKey="packages.step3.check_out_date" />
                      </td>
                      <td className={styles.infoDetail}>
                        {to.format(durationDateFormat)}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.infoTitle}>
                        <HTText translationKey="packages.step3.nights" />
                      </td>
                      <td className={styles.infoDetail}>{nightCounts}</td>
                    </tr>
                    <tr>
                      <td className={styles.infoTitle}>
                        <HTText translationKey="packages.step3.num_rooms" />
                      </td>
                      <td className={styles.infoDetail}>
                        {capacity.numberOfRooms}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.infoTitle}>
                        <HTText translationKey="packages.step3.room_type" />
                      </td>
                      <td className={styles.infoDetail}>{roomType.name}</td>
                    </tr>
                    <tr>
                      <td className={styles.infoTitle}>
                        <HTText translationKey="packages.step3.persons" />
                      </td>
                      <td className={styles.infoDetail}>
                        {this.capacityText()}
                      </td>
                    </tr>
                    {isLoggedIn &&
                      user.id === userId && (
                        <tr className={styles.firstRow}>
                          <td className={styles.infoTitle}>
                            <HTText translationKey="packages.step3.payment_method" />
                          </td>

                          <td className={styles.infoDetail}>
                            {`xxxx-xxxx-xxxx-${creditCard.lastFour}-${
                              creditCard.brand
                            }`}
                          </td>
                        </tr>
                      )}
                    <tr
                      className={
                        isLoggedIn && user.id === userId
                          ? null
                          : styles.firstRow
                      }
                    >
                      <td className={styles.infoTitle}>
                        <HTText translationKey="packages.step3.booking_date" />
                      </td>

                      <td className={styles.infoDetail}>
                        {bookingDate.format(durationDateFormat)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.bookingDetailTitle}>
                <HTText translationKey="packages.step3.package_inclusions" />
              </div>
              <div className={styles.summaryContainer}>
                <div className={styles.packageDetail}>
                  <div>
                    <HTMLComponent html={p.description} />
                  </div>
                </div>
              </div>
              {this.renderTravelistaDetails()}
              <div className={styles.summarySection}>
                <div className={styles.packagePrice}>
                  <HTText translationKey="packages.step3.package_price" />
                </div>
                <span>*</span>
                <div className={styles.price}>
                  <HTCurrency currency={currency} value={price} />
                  <div className={styles.taxInclusive}>
                    <HTText translationKey="packages.step3.tax_inclusive" />
                  </div>
                </div>
                <div className={styles.socialMedias}>
                  <a href={SOCIAL_MEDIA_URL.ig} target="_blank">
                    <img src={igIcon} alt="instagram" />
                  </a>
                  <a href={SOCIAL_MEDIA_URL.fb} target="_blank">
                    <img src={fbIcon} alt="facebook" />
                  </a>
                  <a href={SOCIAL_MEDIA_URL.yt} target="_blank">
                    <img src={ytIcon} alt="youtube" />
                  </a>
                  <a href={SOCIAL_MEDIA_URL.pi} target="_blank">
                    <img src={piIcon} alt="pinterest" />
                  </a>
                  <a href={SOCIAL_MEDIA_URL.gp} target="_blank">
                    <img src={gpIcon} alt="google plus" />
                  </a>
                  <a href={SOCIAL_MEDIA_URL.tw} target="_blank">
                    <img src={twIcon} alt="twiter" />
                  </a>
                </div>
              </div>
              {this.renderDetailsFooter()}
            </div>
            {isLoggedIn &&
              user.id === userId && (
                <div className={cn(foundation['medium-5'], styles.buttons)}>
                  <a href={this.calendarLink()} target="_blank">
                    <div className={styles.buttonContainer}>
                      <HTButton
                        buttonType={'hollowGray'}
                        className={styles.button}
                        text={formatMessage({
                          id: 'packages.step3.add_to_calendar',
                        })}
                        contentClassName={styles.buttonContent}
                      />
                    </div>
                  </a>
                  <Link to="/account">
                    <div className={styles.buttonContainer}>
                      <HTButton
                        buttonType={'hollowGray'}
                        className={styles.button}
                        contentClassName={styles.buttonContent}
                        text={formatMessage({
                          id: 'packages.step3.view_trips',
                        })}
                      />
                    </div>
                  </Link>
                  <div className={styles.buttonContainer}>
                    <HTButton
                      buttonType={'hollowGray'}
                      className={styles.button}
                      contentClassName={styles.buttonContent}
                      onClick={this.props.openShareModal}
                      isDisabled={sendConfirmationRequest.requesting}
                    >
                      <span className={styles.buttonContent}>
                        <HTText translationKey="packages.step3.share_invoice" />
                        {sendConfirmationRequest.requesting ? (
                          <span className={styles.utilityLoadingIndicatior}>
                            <HTLoadingIndicator width={20} height={20} />
                          </span>
                        ) : (
                          ''
                        )}
                      </span>
                    </HTButton>
                  </div>
                  <div className={styles.buttonContainer}>
                    <HTButton
                      buttonType={'hollowGray'}
                      className={styles.button}
                      onClick={this.props.printInvoice}
                      contentClassName={styles.buttonContent}
                      text={formatMessage({
                        id: 'packages.step3.print_invoice',
                      })}
                    />
                  </div>
                  <div className={styles.buttonContainer}>
                    <HTButton
                      buttonType={'hollowGray'}
                      className={styles.button}
                      onClick={this.props.openEmailShareInvoiceModal}
                      isDisabled={sendInvoiceRequest.requesting}
                    >
                      <span className={styles.buttonContent}>
                        <HTText translationKey="packages.step3.email_invoice" />
                        {sendInvoiceRequest.requesting ? (
                          <span className={styles.utilityLoadingIndicatior}>
                            <HTLoadingIndicator width={20} height={20} />
                          </span>
                        ) : (
                          ''
                        )}
                      </span>
                    </HTButton>
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>
    );
  };

  renderDetailsFooter = () => {
    return (
      <div className={styles.detailsFooter}>
        <HTText
          translationKey="packages.step3.license_num"
          values={{ license_num: LICENSE_NUM }}
        />
        <div className={styles.footerLogos}>
          <img src={logoHATA} alt="HATA" />
          <img src={logoTIC} alt="TIC" />
          <img src={logoTAR} alt="TAR" />
        </div>
        <hr />
        <div>
          <HTText translationKey="packages.step3.price_reminder" />
          <br />
          <br />
          <HTText translationKey="packages.step3.cancel_policy" />
        </div>
      </div>
    );
  };

  renderTravelistaDetails = () => {
    const { travelistas } = this.props.order;

    return (
      <div>
        {travelistas.map((travelista: OrderTravelista, index: number) =>
          this.renderTravelistaDetail(travelista, index)
        )}
      </div>
    );
  };

  renderTravelistaDetail = (travelista: OrderTravelista, index: number) => {
    const {
      firstName,
      lastName,
      passportName,
      email,
      mobileNumber,
      trip,
      specialRequest,
    } = travelista;
    const { arrivalDate, arrivalFlight, departureDate, departureFlight } = trip;
    return (
      <Fragment key={`user-${index}`}>
        <div className={styles.summaryTitle}>
          <HTText
            translationKey="packages.step3.guest_detail_title"
            values={{ index: index + 1 }}
          />
        </div>
        <div className={styles.summaryContainer}>
          <div className={styles.summarySection}>
            <div className={foundation['grid-x']}>
              <div className={foundation['medium-5']}>
                <div className={styles.guestContent}>
                  {`${firstName || ''} ${lastName || ''}`}
                </div>
                <div className={styles.guestContent}>{passportName}</div>
                <div className={styles.guestContent}>{email}</div>
                <div className={styles.guestContent}>{mobileNumber}</div>
              </div>
              <div className={foundation['medium-7']}>
                <div className={styles.flightContainer}>
                  <div className={styles.guestContent}>
                    {arrivalDate
                      ? `Arrival at ${arrivalDate.format(flightDateFormat)}`
                      : ''}
                  </div>
                  <div className={styles.guestContent}>{arrivalFlight}</div>
                </div>
                <div className={styles.flightContainer}>
                  <div className={styles.guestContent}>
                    {departureDate
                      ? `Departure at ${departureDate.format(flightDateFormat)}`
                      : ''}
                  </div>
                  <div className={styles.guestContent}>{departureFlight}</div>
                </div>
              </div>
            </div>
            {specialRequest ? (
              <div className={styles.specialRequestTitle}>
                <HTText translationKey="packages.step3.special_request" />
                <div className={styles.specialRequest}>
                  {htmlLineBreak(specialRequest)}
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </Fragment>
    );
  };

  renderPolicy = () => {
    const { hotel } = this.props.order;
    return (
      <div className={cn(styles.policySection, foundation['grid-container'])}>
        <div className={styles.policyTitle}>
          <HTText translationKey="packages.step3.terms_and_conditions" />
        </div>
        <div className={styles.policyContent}>
          <HTMLComponent html={hotel.policy} />
        </div>
      </div>
    );
  };
  render() {
    const { intl: { formatMessage }, isLoggedIn, user } = this.props;

    const { userId } = this.props.order;
    return (
      <div className={styles.mainContent}>
        <section className={styles.bookingConfirmedContainer}>
          <div className={styles.bookingWrapper}>
            <HTImage
              src={bookingConfirmedIcon}
              alt={formatMessage({ id: 'image.icon.booking_confirmed' })}
            />
            <div className={styles.bookingConfirmedTitle}>
              <HTText translationKey="packages.step3.booking_confirmed" />
            </div>
            {isLoggedIn &&
              user.id === userId && (
                <div className={styles.emailHint}>
                  <span
                    className={styles.emailHintContent}
                    id="confirmation-sent-msg"
                  >
                    <HTText translationKey="packages.step3.email_hint" />
                  </span>
                </div>
              )}
          </div>
        </section>
        {this.renderDetails()}
        <div
          className={cn(foundation['grid-container'], styles.nextStepContainer)}
        >
          <Link to="/all-offers">
            <HTButton
              buttonType={'green'}
              contentClassName={styles.nextStepButtonContent}
              text={formatMessage({ id: 'packages.step3.another_offer' })}
            />
          </Link>
        </div>
        {this.renderPolicy()}
      </div>
    );
  }
}

export default PackageStep3View;
