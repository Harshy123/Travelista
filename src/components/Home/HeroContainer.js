// @flow

import * as React from 'react';

import styles from './HeroContainer.scss';

type Props = {
  children?: React.Node,
  heroVideoUrl?: string,
};

export default class HeroContainer extends React.PureComponent<Props> {
  componentDidMount() {
    if (typeof window.objectFitPolyfill === 'function') {
      window.objectFitPolyfill();
    }
  }

  render() {
    const { heroVideoUrl, children } = this.props;

    if (heroVideoUrl === undefined) {
      return <div className={styles.banner}>{children}</div>;
    }

    return (
      <div className={styles.videoContainer}>
        <div className={styles.videoWrapper}>
          <video
            className={styles.video}
            data-object-fit="cover"
            data-object-position="center center"
            src={heroVideoUrl}
            autoPlay={true}
            loop={true}
            muted={true}
          />
        </div>
        {children}
      </div>
    );
  }
}
