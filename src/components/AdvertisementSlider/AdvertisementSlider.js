// @flow

import React, { PureComponent } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames';
import styles from './AdvertisementSlider.scss';
import foundation from '../../styles/foundation.scss';
import nextIcon from '../../images/ic_next.svg';
import prevIcon from '../../images/ic_prev.svg';
import { injectIntl } from 'react-intl';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';
import HTText from '../HTText/HTText';
import HTMLComponent from '../HTMLComponent/HTMLComponent';
import { SLIDER_AUTOPLAY_SPEED } from '../../utils/constants';

import type { IntlShape } from 'react-intl';
import type { Advertisement } from '../../models/Advertisement';
import type { Request } from '../../types';

type ArrowProps = {
  alt: string,
  onClick?: (e: Event) => void,
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
        onClick={this.props.onClick}
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
        onClick={this.props.onClick}
        style={{ top: `${this.top()}px` }}
      >
        <img alt={this.props.alt} src={nextIcon} className={styles.navIcon} />
      </div>
    );
  }
}

type Props = {
  intl: IntlShape,
  advertisements: Advertisement[],
  request: Request,
  showTitle: boolean,
  className?: string,
  titleClassName?: string,
};
class AdvertisementSlider extends PureComponent<Props> {
  slider: React$ElementRef<*>;

  componentWillMount() {
    // (Anson: Note) There is a bug with autoplay of react-slick
    // https://github.com/akiran/react-slick/issues/1231
    // Need to trigger slickNext manually
    setInterval(() => {
      if (this.slider) {
        this.slider.slickNext();
      }
    }, SLIDER_AUTOPLAY_SPEED);
  }

  render() {
    const {
      advertisements,
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
    } else if (advertisements.length > 0) {
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
            {advertisements.length === 1
              ? this.renderSlide(advertisements[0], 0)
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
    const { advertisements, intl: { formatMessage } } = this.props;
    const config = {
      infinite: true,
      nextArrow: <NextNav alt={formatMessage({ id: 'image.slider.next' })} />,
      prevArrow: <PrevNav alt={formatMessage({ id: 'image.slider.prev' })} />,
    };
    return (
      <div className={styles.slideContainer}>
        <Slider ref={this.getSlider} {...config}>
          {advertisements.map(this.renderSlide)}
        </Slider>
      </div>
    );
  };

  onClickPrev = () => {
    this.slider.slickPrev();
  };

  onClickNext = () => {
    this.slider.slickNext();
  };

  renderSlide = (advertisement: Advertisement, index: number) => {
    return (
      <div key={'slide' + index}>
        <a href={advertisement.url} target="_blank">
          {this.renderImage(advertisement)}
          {this.renderDetailed(advertisement)}
        </a>
      </div>
    );
  };

  renderImage = (advertisement: Advertisement) => {
    const { image } = advertisement;
    return (
      <div className={styles.image}>
        <img
          alt={advertisement.name}
          src={image}
          className={styles.backgroundImage}
        />
      </div>
    );
  };

  renderDetailed = (advertisement: Advertisement) => {
    const { name, description } = advertisement;
    return (
      <div className={classNames(foundation['grid-container'])}>
        <div className={styles.name}>{name}</div>
        <div className={styles.description}>
          <HTMLComponent html={description} />
        </div>
      </div>
    );
  };
}

export default injectIntl(AdvertisementSlider);
