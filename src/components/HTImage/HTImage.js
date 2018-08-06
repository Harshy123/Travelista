// @flow

import React, { PureComponent } from 'react';
import type { Node } from 'react';
import Preload from 'react-preloaded';
type Props = {
  src: string,
  className?: string,
  type: 'background' | 'img',
  alt: string,
  objectFit: 'cover' | 'contain' | 'fill',
  width?: number | string,
  height?: number | string,
  preloadIndicator?: Node,
  children?: Node,
};

export default class HTImage extends PureComponent<Props> {
  static defaultProps = {
    type: 'img',
    alt: '',
    objectFit: 'fill',
  };
  renderAsBackground() {
    const { src, width, height, children, className, objectFit } = this.props;
    const style = {
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url('${src}')`,
      backgroundPosition: 'center center',
      backgroundSize: objectFit,
      width,
      height,
    };

    return (
      <figure className={className} style={style}>
        {children}
      </figure>
    );
  }

  renderAsImg() {
    const {
      src,
      objectFit,
      className,
      alt,
      width,
      height,
      children,
    } = this.props;

    if (children) {
      throw new Error('img tag cannot possess children.');
    }

    const style = {
      objectFit,
      width,
      height,
      fontFamily: `"object-fit: ${objectFit};"`,
    };
    return <img className={className} alt={alt} src={src} style={style} />;
  }

  renderWithPreload = () => {
    const { preloadIndicator, src } = this.props;
    return (
      <Preload loadingIndicator={preloadIndicator} images={[src]}>
        {this.renderContent()}
      </Preload>
    );
  };

  renderContent = () => {
    const { type } = this.props;
    if (type === 'background') {
      return this.renderAsBackground();
    } else {
      return this.renderAsImg();
    }
  };

  render() {
    const { preloadIndicator } = this.props;
    if (preloadIndicator != null) {
      return this.renderWithPreload();
    } else {
      return this.renderContent();
    }
  }
}
