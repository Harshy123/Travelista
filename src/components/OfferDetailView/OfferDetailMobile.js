// @flow

import React, { PureComponent } from 'react';
import cn from 'classnames';
import moment from 'moment';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { injectIntl } from 'react-intl';
import { StickyContainer, Sticky } from 'react-sticky';

import HTButton from '../HTButton/HTButton';
import HTImage from '../HTImage/HTImage';
import HTText from '../HTText/HTText';
import HTModal from '../HTModal/HTModal';
import HTAccordion from '../HTAccordion/HTAccordion';
import HTMLComponent from '../HTMLComponent/HTMLComponent';
import HTCurrency from '../../containers/HTCurrency';
import OfferDetailMap from './OfferDetailMap';
import { getViewPointHeight } from '../../utils/utils';
import { diffDays } from '../../utils/time';

import foundation from '../../styles/foundation.scss';
import styles from './OfferDetailMobile.scss';

import greenBackIcon from '../../images/ic_green_back.svg';
import clockIcon from '../../images/ic_clock.svg';
import whatWeLoveIcon from '../../images/ic_what_we_love.svg';
import locationIcon from '../../images/ic_location.svg';
import whatWeLoveGreenIcon from '../../images/ic_what_we_love_green.svg';
import locationGreenIcon from '../../images/ic_location_green.svg';

import type { IntlShape } from 'react-intl';
import type { RoomType } from '../../models/RoomType';
import type { Package } from '../../models/Package';
import type { Offer } from '../../models/Offer';
import type { AddOn } from '../../models/AddOn';

// Mobile version

type Props = {
  intl: IntlShape,
  offer: Offer,
};

type State = {
  tabIndex: ?number,
  isOpenPackageModal: boolean,
  isOpenHotelFacilities: boolean,
};

class OfferDetailMobile extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tabIndex: 0,
      isOpenPackageModal: false,
      isOpenHotelFacilities: false,
    };
  }

  renderInfo = () => {
    const {
      offer: { bookingEndAt, price },
      intl: { formatMessage },
    } = this.props;

    const days = diffDays(bookingEndAt, moment());

    return (
      <div className={styles.info}>
        <div className={foundation['grid-container']}>
          <div className={foundation['grid-x']}>
            <div className={cn(foundation['small-6'], styles.pricing)}>
              <div className={styles.startingFrom}>
                <HTText translationKey={'offer.detail.starting_from'} />
              </div>
              <div className={styles.price}>
                <HTCurrency value={price} />
              </div>
            </div>
            <div className={cn(foundation['small-6'], styles.endIn)}>
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
          </div>
        </div>
      </div>
    );
  };

  onSelect = (index: number, lastIndex: number) => {
    this.setState((state: State) => {
      const { tabIndex } = state;
      return {
        ...state,
        tabIndex: tabIndex === index ? null : index,
      };
    });
  };

  renderMobileTab = () => {
    const {
      offer: { hotel: { whatWeLove, location, address } },
      intl: { formatMessage },
    } = this.props;
    const { tabIndex } = this.state;
    const shouldHideAllTabs = tabIndex === null;
    return (
      <Tabs
        onSelect={this.onSelect}
        className={cn(styles.tabs)}
        selectedTabPanelClassName={styles.tabPanelSelected}
        disabledTabClassName={styles.smallTab}
      >
        <TabList className={styles.tabList}>
          <div className={foundation['grid-x']}>
            <Tab
              className={cn(foundation['small-6'], styles.smallTab, {
                [styles.smallTabSelected]: tabIndex === 0,
              })}
            >
              <HTImage
                src={tabIndex === 0 ? whatWeLoveGreenIcon : whatWeLoveIcon}
                alt={formatMessage({ id: 'offer.detail.tab.what_we_love' })}
                className={styles.smallTabIcon}
              />
              <span className={styles.smallTabText}>
                <HTText translationKey={'offer.detail.tab.what_we_love'} />
              </span>
            </Tab>
            <Tab
              className={cn(foundation['small-6'], styles.smallTab, {
                [styles.smallTabSelected]: tabIndex === 1,
              })}
            >
              <HTImage
                src={tabIndex === 1 ? locationGreenIcon : locationIcon}
                alt={formatMessage({ id: 'offer.detail.tab.how_to_get_there' })}
                className={styles.smallTabIcon}
              />
              <span className={styles.smallTabText}>
                <HTText translationKey={'offer.detail.tab.how_to_get_there'} />
              </span>
            </Tab>
          </div>
        </TabList>
        <TabPanel
          className={cn(styles.smallTabPanel, {
            [styles.hideTab]: shouldHideAllTabs,
          })}
        >
          {this.renderTabPanel(whatWeLove)}
        </TabPanel>
        <TabPanel
          className={cn(styles.smallTabPanel, {
            [styles.hideTab]: shouldHideAllTabs,
          })}
        >
          <OfferDetailMap location={location} address={address} />
        </TabPanel>
      </Tabs>
    );
  };

  renderTabPanel = (text: string) => {
    return (
      <div className={foundation['grid-container']}>
        <div className={foundation['grid-x']}>
          <div className={cn(styles.tabPanelText, foundation['small-12'])}>
            <HTMLComponent html={text} />
          </div>
        </div>
      </div>
    );
  };

  onClickViewPackages = () => {
    this.setState((state: State) => ({
      isOpenPackageModal: !state.isOpenPackageModal,
    }));
  };

  onRequestClose = () => {
    this.setState((state: State) => ({
      isOpenPackageModal: false,
    }));
  };

  renderTab = (room: RoomType) => {
    const { roomTypeInfo } = this.props.offer;
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
      <Tab className={styles.tab} key={room.id}>
        <div className={styles.tabContainer}>
          <div className={styles.roomTabContainer}>
            <div className={styles.roomTabName}>{room.name.toUpperCase()}</div>
            <div className={styles.roomTabPrice}>
              from <HTCurrency value={startingFrom} />
            </div>
          </div>
        </div>
      </Tab>
    );
  };

  renderPackage = (p: Package, room: RoomType) => {
    const { intl: { formatMessage } } = this.props;
    const buttonText = !p.isSoldOut
      ? formatMessage({ id: 'offer.detail.check_dates' })
      : formatMessage({ id: 'offer.detail.sold_out' });

    return (
      <div className={cn(styles.package)} key={p.id}>
        <div className={cn(styles.packageControl, foundation['grid-x'])}>
          <div className={styles.packageImageContainer}>
            <HTImage
              src={p.image}
              alt={p.name}
              objectFit={'cover'}
              className={styles.packageImage}
            />
          </div>

          <div className={styles.packageContent}>
            <div className={styles.packageTitle}>{p.name}</div>
            <div className={styles.packagePrices}>
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
        <HTButton
          buttonType={'green'}
          isDisabled={p.isSoldOut}
          className={styles.packageButton}
          contentClassName={styles.packageButtonContent}
          text={buttonText}
        />
      </div>
    );
  };

  renderPanel = (room: RoomType) => {
    const { roomTypeInfo } = this.props.offer;

    if (roomTypeInfo[room.id] == null) {
      throw Error(`No packages found for room type id ${room.id}`);
    }
    const packages = roomTypeInfo[room.id].packages;
    const packageViews = packages.map((p: Package) =>
      this.renderPackage(p, room)
    );

    return (
      <TabPanel className={styles.tabPanel} key={room.id}>
        <div className={foundation['grid-container']}>
          <div className={styles.roomDescription}>
            <HTMLComponent html={room.description} />
          </div>
          <div className={cn(styles.packages, foundation['grid-x'])}>
            {packageViews}
          </div>
        </div>
      </TabPanel>
    );
  };

  renderPackages = () => {
    const {
      offer: { hotel: { roomTypes } },
      intl: { formatMessage },
    } = this.props;
    return (
      <section className={styles.packagesOverlay}>
        <div className={cn(foundation['grid-container'])}>
          <div className={cn(foundation['grid-x'], styles.packagesHeader)}>
            <div className={foundation['small-2']}>
              <button
                className={'packageBackButton'}
                onClick={this.onRequestClose}
              >
                <HTImage
                  src={greenBackIcon}
                  alt={formatMessage({ id: 'image.icon.back' })}
                  objectFit={'fill'}
                  className={styles.packageBackIcon}
                />
              </button>
            </div>
            <div className={cn(foundation['small-8'])}>
              <div className={styles.packagesTitle}>
                <HTText translationKey="offer.detail.packages" />
              </div>
            </div>
          </div>
        </div>
        <Tabs
          className={styles.tabs}
          selectedTabClassName={styles.tabSelected}
          selectedTabPanelClassName={styles.tabPanelSelected}
        >
          <TabList className={styles.tabList}>
            {roomTypes.map(this.renderTab)}
          </TabList>
          <div className={styles.tabPanels}>
            {roomTypes.map(this.renderPanel)}
          </div>
        </Tabs>
      </section>
    );
  };

  onClickTitle = () => {
    this.setState((state: State) => ({
      isOpenHotelFacilities: !state.isOpenHotelFacilities,
    }));
  };

  renderHotelFacilities = () => {
    const {
      intl: { formatMessage },
      offer: { hotel: { hotelFacilities } },
    } = this.props;
    const { isOpenHotelFacilities } = this.state;
    return (
      <HTAccordion
        isOpen={isOpenHotelFacilities}
        title={formatMessage({ id: 'offer.detail.hotel_facilities' })}
        onClickTitle={this.onClickTitle}
      >
        <div className={cn(styles.facilities, foundation['grid-container'])}>
          <div className={foundation['grid-x']}>
            {hotelFacilities.map((hf: AddOn) => {
              return (
                <div
                  key={hf.id}
                  className={cn(
                    foundation['small-6'],
                    styles.facilityContainer
                  )}
                >
                  <div className={styles.facilityIconContainer}>
                    <HTImage
                      src={hf.image}
                      alt={hf.name}
                      className={styles.facilityIcon}
                      objectFit={'fill'}
                    />
                  </div>
                  <span className={styles.facilityText}>{hf.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </HTAccordion>
    );
  };

  render() {
    const { hotel: { about } } = this.props.offer;
    const { intl: { formatMessage } } = this.props;
    const { isOpenPackageModal } = this.state;
    return (
      <div className={cn(styles.mobile, foundation['show-for-small-only'])}>
        {this.renderInfo()}
        <div className={cn(foundation['grid-container'], styles.about)}>
          <HTMLComponent html={about} />
        </div>
        {this.renderHotelFacilities()}
        {this.renderMobileTab()}
        <StickyContainer>
          <Sticky>
            {({
              calculatedHeight,
              distanceFromBottom,
            }: {
              calculatedHeight: number,
              distanceFromBottom: number,
            }) => {
              const viewPointHeight = getViewPointHeight();
              const isSticky =
                viewPointHeight < distanceFromBottom + calculatedHeight;
              const position =
                !distanceFromBottom || isSticky ? 'fixed' : 'relative';

              const compensationPosition = isSticky ? 'relative' : 'fixed';
              const style = {
                position,
                bottom: 0,
              };

              const compensationStyle = {
                position: compensationPosition,
                paddingTop: calculatedHeight,
              };
              return (
                <div>
                  <div style={compensationStyle} />
                  <HTButton
                    style={style}
                    buttonType={'green'}
                    text={formatMessage({ id: 'offer.detail.view_packages' })}
                    className={styles.viewPackagesButton}
                    onClick={this.onClickViewPackages}
                  />
                </div>
              );
            }}
          </Sticky>
          <HTModal
            className={styles.packagesModal}
            isOpen={isOpenPackageModal}
            onRequestClose={this.onRequestClose}
          >
            {this.renderPackages()}
          </HTModal>
        </StickyContainer>
      </div>
    );
  }
}

export default injectIntl(OfferDetailMobile);
