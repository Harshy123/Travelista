// @flow

import React, { PureComponent } from 'react';
import cn from 'classnames';
import Slider from 'react-slick';
import { injectIntl } from 'react-intl';

import styles from './HTSlider.scss';
import foundation from '../../styles/foundation.scss';
import prevIcon from '../../images/ic_prev.svg';
import nextIcon from '../../images/ic_next.svg';

import type { IntlShape } from 'react-intl';
import type { ElementRef, Node } from 'react';
import type { Slider as SliderType } from 'react-slick';

type Props = {
  intl: IntlShape,
  overlay?: Node,
  onClick?: () => void,
  children: Node,
};

type State = {
  slideIndex: number,
};
class HTSlider extends PureComponent<Props, State> {
  slider: ElementRef<SliderType>;
  dragging: boolean;
  constructor(props: Props) {
    super(props);
    this.dragging = false;
    this.state = {
      slideIndex: 0,
    };
  }

  getSliderRef = (r: ElementRef<SliderType>) => {
    this.slider = r;
  };

  onClickPrev = (e: Event) => {
    e.preventDefault();
    this.slider.slickPrev();
  };

  onClickNext = (e: Event) => {
    e.preventDefault();
    this.slider.slickNext();
  };

  beforeSliderChange = () => {
    this.dragging = true;
  };
  afterSliderChange = (index: number) => {
    this.dragging = false;
    this.setState((state: State) => ({
      slideIndex: index,
    }));
  };

  customPaging = (i: number) => {
    const dotClass = cn(styles.dot, {
      [styles.dotActive]: i === this.state.slideIndex,
    });
    return <div className={dotClass}>.</div>;
  };

  onClickSlide = (e: Event) => {
    if (!this.dragging) {
      if (this.props.onClick) {
        this.props.onClick();
      }
    } else {
      e.preventDefault();
    }
  };

  render() {
    const { intl, children } = this.props;
    const sliderSettings = {
      infinite: false,
      className: styles.slider,
      beforeChange: this.beforeSliderChange,
      afterChange: this.afterSliderChange,
      arrows: true,
      dots: true,
      dotsClass: styles.dots,
      customPaging: this.customPaging,
      nextArrow: <NextArrow intl={intl} onClick={this.onClickNext} />,
      prevArrow: <PrevArrow intl={intl} onClick={this.onClickPrev} />,
    };
    return (
      <div className={styles.sliderContainer} onClick={this.onClickSlide}>
        <Slider ref={this.getSliderRef} {...sliderSettings}>
          {children}
        </Slider>
        <div className={styles.overlay} />
      </div>
    );
  }
}

type ArrowProps = {
  intl: IntlShape,
  currentSlide?: number,
  slideCount?: number,
  onClick: (e: Event) => void,
};

class NextArrow extends PureComponent<ArrowProps> {
  render() {
    const {
      currentSlide,
      slideCount,
      onClick,
      intl: { formatMessage },
    } = this.props;
    if (slideCount == null) {
      return null;
    }
    const className = cn(styles.navWrapper, {
      [foundation['hide']]: currentSlide === slideCount - 1,
    });
    return (
      <div className={className} onClick={onClick}>
        <img
          alt={formatMessage({ id: 'image.slider.next' })}
          src={nextIcon}
          className={styles.navIcon}
        />
      </div>
    );
  }
}

class PrevArrow extends PureComponent<ArrowProps> {
  render() {
    const { currentSlide, onClick, intl: { formatMessage } } = this.props;
    const className = cn(styles.navWrapper, {
      [foundation['hide']]: currentSlide === 0,
    });
    return (
      <div className={className} onClick={onClick}>
        <img
          alt={formatMessage({ id: 'image.slider.prev' })}
          src={prevIcon}
          className={styles.navIcon}
        />
      </div>
    );
  }
}
export default injectIntl(HTSlider);
