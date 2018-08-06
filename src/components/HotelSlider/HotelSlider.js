// @flow

import React, { PureComponent } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames';
import moment from 'moment';
import styles from './HotelSlider.scss';
import foundation from '../../styles/foundation.scss';
import clockIcon from '../../images/ic_clock.svg';
import HTButton from '../HTButton/HTButton';
import nextIcon from '../../images/ic_next.svg';
import prevIcon from '../../images/ic_prev.svg';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import type { OfferListItem } from '../../models/OfferListItem';
import type { Request } from '../../types';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';
import HTText from '../HTText/HTText';
import { diffDays } from '../../utils/time';
import { SLIDER_AUTOPLAY_SPEED } from '../../utils/constants';

type ArrowProps = {
  alt: string,
};

type State = {
  anchorHeight: number,
};

class PrevNav extends PureComponent<ArrowProps, State> {
  constructor(props: ArrowProps) {
    super(props);

    this.state = {
      anchorHeight: 0,
    };
  }

  updateDimensions = () => {
    const anchorHeight = document.getElementsByClassName(styles.image)[0]
      .clientHeight;
    this.setState({ anchorHeight: anchorHeight });
  };

  componentWillMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentDidMount() {
    this.updateDimensions();
  }

  top = () => {
    let navHeight = 35;
    if (window.innerWidth > 640) {
      navHeight = 85;
    }
    return this.state.anchorHeight / 2 - navHeight / 2;
  };

  render() {
    return (
      <div
        className={classNames(styles.navWrapper, styles.navPrev)}
        style={{ top: `${this.top()}px` }}
      >
        <img alt={this.props.alt} src={prevIcon} className={styles.navIcon} />
      </div>
    );
  }
}

class NextNav extends PureComponent<ArrowProps, State> {
  constructor(props: ArrowProps) {
    super(props);

    this.state = {
      anchorHeight: 0,
    };
  }

  updateDimensions = () => {
    const anchorHeight = document.getElementsByClassName(styles.image)[0]
      .clientHeight;
    this.setState({ anchorHeight: anchorHeight });
  };

  componentWillMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentDidMount() {
    this.updateDimensions();
  }

  top = () => {
    let navHeight = 35;
    if (window.innerWidth > 640) {
      navHeight = 85;
    }
    return this.state.anchorHeight / 2 - navHeight / 2;
  };

  render() {
    return (
      <div
        className={classNames(styles.navWrapper, styles.navNext)}
        style={{ top: `${this.top()}px` }}
      >
        <img alt={this.props.alt} src={nextIcon} className={styles.navIcon} />
      </div>
    );
  }
}

type Props = {
  intl: IntlShape,
  isLoggedIn: boolean,
  offers: OfferListItem[],
  request: Request,
  fetchOffers: () => void,
  push: string => void,
  openAuthModal: ('signin' | 'signup') => void,
  showTitle: boolean,
  className?: string,
  titleClassName?: string,
};

class HotelSlider extends PureComponent<Props> {
  slider: React$ElementRef<*>;

  componentWillMount() {
    this.props.fetchOffers();
    // (Anson: Note) There is a bug with autoplay of react-slick
    // https://github.com/akiran/react-slick/issues/1231
    // Need to trigger slickNext manually
    setInterval(() => {
      if (this.slider) {
        this.slider.slickNext();
      }
    }, SLIDER_AUTOPLAY_SPEED);
  }

  onClickDetail = (offer: OfferListItem) => () => {
    const { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      this.props.openAuthModal('signin');
    } else {
      this.props.push(`/hotel/${offer.hotel.slug}/offer/${offer.id}`);
    }
  };

  render() {
    const {
      offers,
      request,
      showTitle,
      className,
      titleClassName,
    } = this.props;
    if (request.requesting) {
      return (
        <div className={styles.loadingContainer}>
          <HTLoadingIndicator />
        </div>
      );
    } else if (offers.length > 0) {
      return (
        <section className={className}>
          <div
            className={classNames(titleClassName, {
              [foundation['hide']]: !showTitle,
            })}
          >
            <HTText translationKey="home.feature_property.title" />
          </div>
          <div>
            {offers.length === 1
              ? this.renderSlide(offers[0], 0)
              : this.renderSlider()}
          </div>
        </section>
      );
    } else {
      return null;
    }
  }

  getSlider = (r: React$ElementRef<*>) => {
    this.slider = r;
  };

  renderSlider = () => {
    const { offers, intl: { formatMessage } } = this.props;
    if (offers.length === 0) {
      return <div className={styles.slideContainer} />;
    }
    return (
      <div className={styles.slideContainer}>
        <Slider
          infinite={true}
          ref={this.getSlider}
          nextArrow={
            <NextNav alt={formatMessage({ id: 'image.slider.next' })} />
          }
          prevArrow={
            <PrevNav alt={formatMessage({ id: 'image.slider.prev' })} />
          }
        >
          {offers.map(this.renderSlide)}
        </Slider>
      </div>
    );
  };

  renderSlide = (offer: OfferListItem, index: number) => {
    return (
      <div key={'slide' + index}>
        {this.renderImage(offer)}
        {this.renderDetailed(offer)}
      </div>
    );
  };

  renderImage = (offer: OfferListItem) => {
    const { name, images, logo } = offer.hotel;
    return (
      <div className={styles.image}>
        <img
          alt={name}
          src={images[0] || ''}
          className={styles.backgroundImage}
        />
        <div
          className={classNames(
            foundation['grid-container'],
            styles.slideContent
          )}
        >
          <img alt={name} src={logo} className={styles.logo} />
        </div>
      </div>
    );
  };

  renderDetailed = (offer: OfferListItem) => {
    const { intl: { formatMessage } } = this.props;
    const { hotel: { name }, bookingEndAt } = offer;
    const days = diffDays(bookingEndAt, moment());

    return (
      <div className={classNames(foundation['grid-container'])}>
        <div className={styles.hotelName}>{name}</div>
        <div className={styles.time}>
          <img
            alt={formatMessage({ id: 'image.icon.clock' })}
            src={clockIcon}
            className={styles.clockIcon}
          />
          <span className={styles.timeDetail}>
            <HTText translationKey="hotel_listing.end_in" />
            <span className={styles.days}>
              <HTText
                translationKey="hotel_listing.end_in_day"
                values={{ days }}
              />
            </span>
          </span>
        </div>
        <HTButton
          className={styles.viewDetailButton}
          buttonType={'hollowBlack'}
          contentClassName={styles.buttonContent}
          text={formatMessage({ id: 'hotel_listing.view_detail' })}
          onClick={this.onClickDetail(offer)}
        />
      </div>
    );
  };
}

export default injectIntl(HotelSlider);
