// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import cn from 'classnames';
import moment from 'moment';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

import EmailShareModal from '../EmailShareModal/EmailShareModal';
import HTButton from '../HTButton/HTButton';
import HTImage from '../HTImage/HTImage';
import HTText from '../HTText/HTText';
import HTMLComponent from '../HTMLComponent/HTMLComponent';
import ShareModal from '../ShareModal/ShareModal';

import apiClient from '../../api';
import HTCurrency from '../../containers/HTCurrency';
import Advertisement from '../../containers/Advertisement';
import SimilarOfferCollectionContainer from '../../containers/SimilarOfferCollectionContainer';
import { generateOfferLink } from '../../models/Offer';
import OfferDetailMap from './OfferDetailMap';
import { sortAddOns, getOfferMinNightCount } from '../../utils/offer';
import { diffDays } from '../../utils/time';
import { toastrError, toastrSuccess } from '../../utils/toastr';

import clockIcon from '../../images/ic_clock.svg';
import shareIcon from '../../images/ic_share.svg';
import foundation from '../../styles/foundation.scss';
import styles from './OfferDetailDesktop.scss';

import type Moment from 'moment';
import type { IntlShape } from 'react-intl';
import type { RoomType } from '../../models/RoomType';
import type { Package } from '../../models/Package';
import type { Offer } from '../../models/Offer';
import type { AddOn } from '../../models/AddOn';
import type { Request } from '../../types';
import type { HotelDate } from '../../models/HotelDate';

type Props = {
  intl: IntlShape,
  offer: Offer,
  hotelDateRequests: {
    [string]: Request,
  },
  hotelDateMap: {
    [string]: {
      [string]: HotelDate,
    },
  },
  fetchHotelDates: (string, string, Moment, Moment) => Promise<HotelDate[]>,
  flushHotelDateRequests: () => void,
  openPackageDescriptionModal: (p: Package, roomType: RoomType) => void,
};

type State = {
  isEmailShareModalOpen: boolean,
  isShareModalOpen: boolean,
};

class OfferDetailDesktop extends PureComponent<Props, State> {
  state = {
    isEmailShareModalOpen: false,
    isShareModalOpen: false,
  };

  renderRooms = () => {
    const { roomTypeInfo, hotel: { roomTypes } } = this.props.offer;
    const tabs = roomTypes.map((room: RoomType) => {
      const info = roomTypeInfo[room.id];
      if (info == null) {
        throw new Error(`cannot find room with id ${room.id}`);
      }
      const startingFrom = info.packages.reduce((p1: Package, p2: Package) => {
        if (p1.startingFrom < p2.startingFrom) {
          return p1;
        } else {
          return p2;
        }
      }).startingFrom;
      return (
        <Tab key={room.id} className={styles.roomTab}>
          <div className={styles.roomTabContainer}>
            <div className={styles.roomTabName}>{room.name.toUpperCase()}</div>
            <div className={styles.roomTabPrice}>
              from <HTCurrency value={startingFrom} />
            </div>
          </div>
        </Tab>
      );
    });

    const panels = roomTypes.map((room: RoomType) => {
      if (roomTypeInfo[room.id] == null) {
        return null;
      }
      const packages = roomTypeInfo[room.id].packages;
      if (packages == null) {
        throw Error(`No packages found for room type id ${room.id}`);
      }

      const packageViews = packages.map((p: Package) =>
        this.renderPackage(p, room)
      );

      return (
        <TabPanel className={styles.roomPanel} key={room.id}>
          <div className={styles.roomDescription}>
            <HTMLComponent html={room.description} />
          </div>
          {room.addOns.length > 0 && (
            <div className={styles.roomTypeAddOnsContainer}>
              <div className={styles.roomFacilities}>
                <HTText translationKey="offer.detail.room_facilities" />
              </div>
              {sortAddOns(room.addOns).map((addOn: AddOn) => (
                <div className={cn(styles.roomTypeAddOnWrapper)} key={addOn.id}>
                  <div className={styles.roomTypeAddOnContent}>
                    <span className={styles.roomTypeAddOnImageContainer}>
                      <HTImage src={addOn.image} alt={addOn.name} width={44} />
                    </span>
                    <span className={styles.roomTypeAddOnText}>
                      {addOn.name.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={cn(styles.packages, foundation['grid-x'])}>
            {packageViews}
          </div>
        </TabPanel>
      );
    });
    return (
      <section className={foundation['grid-container']}>
        <div className={styles.offerSectionTitle}>
          <HTText translationKey={'offer.detail.package_options'} />
        </div>
        <Tabs
          className={styles.roomTabs}
          selectedTabClassName={styles.roomTabSelected}
          selectedTabPanelClassName={styles.roomPanelSelected}
        >
          <TabList className={styles.roomTabList}>{tabs}</TabList>
          <div className={styles.roomPanels}>{panels}</div>
        </Tabs>
      </section>
    );
  };

  renderTabs = () => {
    const {
      hotel: { about, whatWeLove, location, address },
    } = this.props.offer;
    return (
      <section>
        <Tabs
          className={styles.tabs}
          selectedTabClassName={styles.tabSelected}
          selectedTabPanelClassName={styles.tabPanelSelected}
        >
          <TabList className={styles.tabList}>
            <div className={foundation['grid-container']}>
              <div className={foundation['grid-x']}>
                <div className={foundation['medium-8']}>
                  <Tab className={styles.tab}>
                    <HTText translationKey={'offer.detail.tab.about'} />
                  </Tab>
                  <Tab className={styles.tab}>
                    <HTText translationKey={'offer.detail.tab.what_we_love'} />
                  </Tab>
                  <Tab className={styles.tab}>
                    <HTText
                      translationKey={'offer.detail.tab.how_to_get_there'}
                    />
                  </Tab>
                </div>
              </div>
            </div>
          </TabList>
          <TabPanel className={styles.tabPanel}>
            {this.renderTabPanel(about)}
          </TabPanel>
          <TabPanel className={styles.tabPanel}>
            {this.renderTabPanel(whatWeLove)}
          </TabPanel>
          <TabPanel className={styles.tabPanel}>
            <OfferDetailMap location={location} address={address} />
          </TabPanel>
        </Tabs>
      </section>
    );
  };

  renderInfo = () => {
    const {
      offer: { bookingEndAt, price },
      intl: { formatMessage },
    } = this.props;
    const days = diffDays(bookingEndAt, moment());

    return (
      <div className={cn(foundation['medium-4'], styles.info)}>
        <div className={foundation['grid-container']}>
          <div className={foundation['grid-x']}>
            <div className={cn(foundation['medium-12'], styles.pricing)}>
              <div className={styles.startingFrom}>
                <HTText translationKey={'offer.detail.starting_from'} />
              </div>
              <div className={styles.perStay}>
                <HTText translationKey="offer.detail.per_stay" />
              </div>
              <div className={styles.pricePerNights}>
                <div className={styles.price}>
                  <HTCurrency value={price} />
                </div>
                <div className={styles.perNights}>
                  <HTText
                    translationKey={'offer.detail.per_nights'}
                    values={{ nights: getOfferMinNightCount(this.props.offer) }}
                  />
                </div>
                <div className={styles.taxInclusive}>
                  <HTText translationKey={'offer.detail.tax_inclusive'} />
                </div>
              </div>
            </div>
            <div className={cn(foundation['medium-12'], styles.endIn)}>
              <span className={styles.iconContainer}>
                <HTImage
                  src={clockIcon}
                  alt={formatMessage({ id: 'image.icon.clock' })}
                  objectFit={'fill'}
                  className={styles.iconClock}
                />
              </span>
              {days > 0 ? (
                <HTText
                  translationKey={'offer.detail.end_in'}
                  values={{
                    days: (
                      <b className={styles.endInBold}>
                        <HTText
                          translationKey={'offer.days'}
                          values={{ days }}
                        />
                      </b>
                    ),
                  }}
                />
              ) : (
                <b className={styles.endInBold}>
                  <HTText translationKey={'offer.detail.expired'} />
                </b>
              )}
            </div>
            <div
              className={cn(foundation['medium-12'], styles.share)}
              onClick={this.handleShareButtonClick}
            >
              <span className={styles.iconContainer}>
                <HTImage
                  src={shareIcon}
                  alt={formatMessage({ id: 'image.icon.share' })}
                  objectFit={'fill'}
                  width={15}
                  height={15}
                />
              </span>
              <span>
                <HTText translationKey={'offer.detail.share'} />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderTabPanel = (text: string) => {
    return (
      <div className={foundation['grid-container']}>
        <div className={foundation['grid-x']}>
          <div className={cn(styles.tabPanelText, foundation['medium-8'])}>
            <HTMLComponent html={text} />
          </div>
          <div className={cn(foundation['medium-4'])}>{this.renderInfo()}</div>
        </div>
      </div>
    );
  };

  openPackageDescriptionModal = (p: Package, roomType: RoomType) => () => {
    const { openPackageDescriptionModal } = this.props;
    openPackageDescriptionModal(p, roomType);
  };

  renderPackage = (p: Package, room: RoomType) => {
    const { intl: { formatMessage } } = this.props;
    const buttonText = !p.isSoldOut
      ? formatMessage({ id: 'offer.detail.check_dates' })
      : formatMessage({ id: 'offer.detail.sold_out' });

    const packageImageView = (
      <HTImage
        src={p.image}
        alt={p.name}
        objectFit={'cover'}
        className={styles.packageImage}
      />
    );

    const packageButton = (
      <HTButton
        buttonType={'green'}
        isDisabled={p.isSoldOut}
        className={styles.packageButton}
        contentClassName={styles.packageButtonContent}
        text={buttonText}
        info={p}
        onClick={this.openPackageDescriptionModal(p, room)}
      />
    );

    return (
      <div className={cn(styles.package, foundation['medium-6'])} key={p.id}>
        <div
          className={styles.packageImageContainer}
          onClick={
            p.isSoldOut ? null : this.openPackageDescriptionModal(p, room)
          }
        >
          {packageImageView}
        </div>
        <div className={cn(styles.packageControl, foundation['grid-x'])}>
          <div className={cn(foundation['medium-8'])}>
            <div className={styles.packageInfo}>
              <div className={styles.packageName}>{p.name}</div>
              <div>
                <div className={styles.packagePriceContainer}>
                  <div className={styles.packagePriceTitle}>
                    <HTText translationKey={'offer.detail.starting_from'} />
                  </div>
                  <div className={styles.packagePrice}>
                    <HTCurrency value={p.startingFrom} />
                  </div>
                </div>
                <div className={styles.packagePriceContainer}>
                  <div className={styles.packagePriceTitle}>
                    <HTText translationKey={'offer.detail.save_up_to'} />
                  </div>
                  <div className={styles.packagePrice}>
                    <HTCurrency value={p.saveUpTo} roundTo8={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={foundation['medium-4']}>{packageButton}</div>
        </div>
        {p.addOns.length > 0 && (
          <div className={styles.packageAddOnsWrapper}>
            <div className={styles.packageInclusion}>
              <HTText translationKey="offer.detail.package_inclusions" />
            </div>
            <div
              className={cn(
                foundation['grid-x'],
                styles.packageAddOnsContainer
              )}
            >
              {sortAddOns(p.addOns).map((addOn: AddOn) => (
                <div className={cn(styles.packageAddOnWrapper)} key={addOn.id}>
                  <HTImage src={addOn.image} alt={addOn.name} width={35} />
                  <div className={styles.addOnText}>
                    {addOn.name.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  renderHotelFacilities = () => {
    const { hotel: { hotelFacilities } } = this.props.offer;

    if (hotelFacilities.length === 0) {
      return null;
    }

    return (
      <section className={styles.hotelSection}>
        <div className={styles.offerSectionTitle}>
          <HTText translationKey={'offer.detail.hotel_facilities'} />
        </div>
        <div className={foundation['grid-container']}>
          <div className={foundation['grid-x']}>
            {sortAddOns(hotelFacilities).map((hf: AddOn) => (
              <div
                key={hf.id}
                className={cn(foundation['medium-2'], styles.facility)}
              >
                <span className={styles.facilityImageContainer}>
                  <HTImage
                    className={styles.hotelFacilityIconContainer}
                    alt={hf.name}
                    src={hf.image}
                    width={45}
                  />
                </span>
                <span className={styles.facilityText}>{hf.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  renderSimilarOffers = () => {
    const { offer: { id } } = this.props;
    return (
      <SimilarOfferCollectionContainer
        className={styles.hotelSection}
        titleClassName={styles.offerSectionTitle}
        offerId={id}
      />
    );
  };
  renderOfferDetail = () => {
    return (
      <div>
        {this.renderTabs()}
        {this.renderHotelFacilities()}
        {this.renderRooms()}
        {this.renderSimilarOffers()}
      </div>
    );
  };

  render() {
    const { intl: { formatMessage }, offer } = this.props;
    const { isEmailShareModalOpen, isShareModalOpen } = this.state;

    return (
      <div className={cn(styles.desktop, foundation['hide-for-small-only'])}>
        {this.renderOfferDetail()}
        <ShareModal
          facebookShareLink={generateOfferLink(offer.hotel.slug, offer.id)}
          isOpen={isShareModalOpen}
          onClose={this.handleShareModalClose}
          onShareToEmailClick={this.handleShareToEmailClick}
        />
        <EmailShareModal
          isOpen={isEmailShareModalOpen}
          closeModal={this.handleEmailShareModalClose}
          title={formatMessage({ id: 'offer.detail.share.modal.title' })}
          onSend={this.handleEmailShareModalSend}
        />
        <Advertisement />
      </div>
    );
  }

  handleShareModalClose = () => {
    this.setState({
      isShareModalOpen: false,
    });
  };

  handleShareButtonClick = () => {
    this.setState({
      isShareModalOpen: true,
    });
  };

  handleShareToEmailClick = () => {
    this.setState({
      isEmailShareModalOpen: true,
    });
  };

  handleEmailShareModalClose = () => {
    this.setState({
      isEmailShareModalOpen: false,
    });
  };

  handleEmailShareModalSend = (emails: string[], message: string) => {
    const { intl: { formatMessage }, offer } = this.props;

    apiClient.sendOffer(offer.id, emails, message).then(
      () => {
        this.setState({
          isEmailShareModalOpen: false,
          isShareModalOpen: false,
        });

        toastrSuccess(
          formatMessage({ id: 'offer.detail.share.modal.success' })
        );
      },
      // eslint-disable-next-line flowtype/no-weak-types
      (error: any) => {
        // eslint-disable-next-line no-console
        console.log('Failed to share offer by email', error);

        toastrError(formatMessage({ id: 'offer.detail.share.modal.error' }));
      }
    );
  };
}

export default injectIntl(OfferDetailDesktop);
