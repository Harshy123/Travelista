// @flow

import React, { PureComponent } from 'react';
import ReactIScroll from 'react-iscroll';
import iScroll from 'iscroll';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import foundation from '../../styles/foundation.scss';
import styles from './HomeView.scss';

import familyImage from '../../images/img_family.jpg';
import adventureImage from '../../images/img_adventure.jpg';
import urbanImage from '../../images/img_urban.jpg';
import allExperiencesImage from '../../images/img_all_experiences.jpg';
import romanceImage from '../../images/img_romance.jpg';
import seaSideImage from '../../images/img_seaside.jpg';
import relaxationImage from '../../images/img_relaxation.jpg';

import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import FeaturedProperty from '../../containers/FeaturedProperty';
import Advertisement from '../../containers/Advertisement';
import Navigation from '../../containers/Navigation';
import HTLink from '../../containers/HTLink';

import HeroContainer from './HeroContainer';

import type { IntlShape } from 'react-intl';
import type { RouterHistory, Match } from 'react-router-dom';
import type { HotelGroupState } from '../../states/hotelGroup';
import type { AdvertisementState } from '../../states/advertisement';
import type { Experience } from '../../models/Experience';
import type { HotelGroup } from '../../models/HotelGroup';
import type { ServerState } from '../../models/ServerState';
import type { AppState } from '../../states/app';

type Props = {
  app: AppState,
  hotelGroup: HotelGroupState,
  advertisement: AdvertisementState,
  intl: IntlShape,
  history: RouterHistory,
  isLoggedIn: boolean,
  match: Match,
  openAuthModal: ('signin' | 'signup') => void,
  push: string => void,
  fetchHotelGroups: void => void,
};

class HomeView extends PureComponent<Props> {
  componentWillMount() {
    const { fetchHotelGroups } = this.props;
    fetchHotelGroups();
  }

  render() {
    const { app: { serverState } } = this.props;

    return (
      <div>
        {this.renderBanner(serverState)}
        {this.renderContent()}
      </div>
    );
  }

  renderBanner = (serverState: ServerState) => {
    const { heroVideoUrl } = serverState;

    return (
      <HeroContainer heroVideoUrl={heroVideoUrl || undefined}>
        {this.renderHeader()}
        {this.renderBannerContent(serverState)}
      </HeroContainer>
    );
  };

  renderHeader = () => {
    return (
      <header className={styles.header}>
        <Navigation transparent hideAuthLinks={true} />
      </header>
    );
  };

  onClickSignup = () => {
    this.props.openAuthModal('signup');
  };

  onClickLogin = () => {
    this.props.openAuthModal('signin');
  };

  onClickViewOffers = () => {
    this.props.push('/all-offers');
  };

  renderBannerContent = (serverState: ServerState) => {
    const { intl: { formatMessage } } = this.props;
    return (
      <div className={foundation['grid-container']}>
        <div className={classNames(foundation['grid-x'])}>
          <div
            className={classNames(
              foundation['medium-6'],
              foundation['small-12'],
              foundation['cell']
            )}
          >
            <div className={styles.blurb}>
              <div className={foundation['hide-for-small-only']}>
                {serverState.heroText ||
                  'PERFECTLY CURATED HOTELS TO INSPIRE, INDULGE AND ENRICH YOUR LIFESTYLE'}
              </div>
            </div>
            <div className={styles.buttonGroup}>
              {!this.props.isLoggedIn && (
                <div>
                  <HTButton
                    buttonType={'green'}
                    className={styles.button}
                    text={formatMessage({ id: 'home.banenr.signup' })}
                    onClick={this.onClickSignup}
                  />
                  <HTButton
                    buttonType={'black'}
                    className={styles.button}
                    text={formatMessage({ id: 'home.banner.signin' })}
                    onClick={this.onClickLogin}
                  />
                </div>
              )}
              <HTButton
                buttonType={'gray'}
                className={styles.button}
                onClick={this.onClickViewOffers}
                text={formatMessage({ id: 'home.banner.offers' })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderContent = () => {
    return (
      <div>
        {this.renderBeInspired()}
        {this.renderSlider()}
        {this.renderPartnerHotels()}
        {this.renderPartners()}
        {this.renderAdvertisement()}
      </div>
    );
  };

  renderSlider = () => {
    return (
      <FeaturedProperty
        showTitle={true}
        className={styles.section}
        titleClassName={styles.sectionTitle}
      />
    );
  };

  renderAdvertisement = () => {
    return (
      <section className={styles.section}>
        <Advertisement
          showTitle={false}
          className={styles.section}
          titleClassName={styles.sectionTitle}
        />
      </section>
    );
  };

  renderPartnerHotels = () => {
    const hotelGroups = this.props.hotelGroup.hotelGroups || [];
    return (
      <section className={styles.section}>
        <div className={foundation['grid-container']}>
          <div className={styles.sectionTitle}>
            {' '}
            <HTText translationKey="home.travelista_partner_hotels.title" />
          </div>
          <div className={styles.hotelGroupImages}>
            {hotelGroups.map((hotelGroup: HotelGroup, i: number) => {
              const { slug, name, image } = hotelGroup;
              return (
                <HTLink to={`/partners/hotel/${slug}`} key={'hotelGroup' + i}>
                  <img alt={name} src={image} />
                </HTLink>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  renderPartners = () => {
    const { app: { serverState }, intl: { formatMessage } } = this.props;
    const partnersImage = serverState.partnersImage;
    return (
      <section className={styles.section}>
        <div className={foundation['grid-container']}>
          <div className={styles.sectionTitle}>
            <HTText translationKey="home.travelista_partners.title" />
          </div>
          <img
            alt={formatMessage({ id: 'home.travelista_partners.title' })}
            src={partnersImage}
            className={styles.image}
          />
        </div>
      </section>
    );
  };

  renderBeInspired = () => {
    return (
      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <HTText translationKey={'home.be_inspired.title'} />
        </div>
        <div className={foundation['grid-container']}>{this.renderGrid()}</div>
        {this.renderMobileScrollView()}
      </section>
    );
  };

  renderMobileScrollView = () => {
    const config = {
      mouseWheel: true,
      scrollX: true,
      eventPassthrough: true,
    };
    return (
      <ReactIScroll iScroll={iScroll} options={config}>
        <div className={styles.scrollView}>
          {this.renderMobileScrollItem(allExperiencesImage, null)}
          {this.renderMobileScrollItem(romanceImage, 'romance')}
          {this.renderMobileScrollItem(urbanImage, 'urban')}
          {this.renderMobileScrollItem(relaxationImage, 'relaxation')}
          {this.renderMobileScrollItem(familyImage, 'family')}
          {this.renderMobileScrollItem(seaSideImage, 'seaside')}
          {this.renderMobileScrollItem(adventureImage, 'adventure')}
        </div>
      </ReactIScroll>
    );
  };

  renderMobileScrollItem = (imageSrc: string, experienceId: ?string) => {
    const experiences = this.props.app.experiences || [];
    const experience = experiences.find(
      (experience: Experience) => experience.id === experienceId
    );
    const to = experience ? `/all-offers/${experience.id}` : `/all-offers`;
    return (
      <div className={styles.scrollItemContainer}>
        <HTLink to={to} isPrivate={false}>
          <div
            className={styles.scrollItem}
            style={{
              backgroundImage: `url(${imageSrc})`,
            }}
          >
            <div className={styles.itemName}>
              <span className={styles.itemNameText}>
                {experience ? (
                  experience.name
                ) : (
                  <HTText translationKey={'offer.view_all_experiences'} />
                )}
              </span>
            </div>
          </div>
        </HTLink>
      </div>
    );
  };

  renderGrid = () => {
    return (
      <div className={styles.grid}>
        <div className={styles.column}>
          <div className={styles.shortRow}>
            {this.renderGridCell(romanceImage, 'romance')}
          </div>
          <div className={styles.longRow}>
            {this.renderGridCell(urbanImage, 'urban')}
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.shortRow}>
            {this.renderGridCell(relaxationImage, 'relaxation')}
          </div>
          <div className={styles.shortRow}>
            {this.renderGridCell(allExperiencesImage, null)}
          </div>
          <div className={styles.shortRow}>
            {this.renderGridCell(familyImage, 'family')}
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.longRow}>
            {this.renderGridCell(seaSideImage, 'seaside')}
          </div>
          <div className={styles.shortRow}>
            {this.renderGridCell(adventureImage, 'adventure')}
          </div>
        </div>
      </div>
    );
  };

  renderGridCell = (imageSrc: string, experienceId: ?string) => {
    const { intl: { formatMessage } } = this.props;
    const experiences = this.props.app.experiences || [];
    const experience = experiences.find(
      (experience: Experience) => experience.id === experienceId
    );
    const to = experience ? `/all-offers/${experience.id}` : `/all-offers`;
    return (
      <HTLink to={to} isPrivate={false}>
        <div className={styles.cell}>
          <div className={styles.cellInfo}>
            <div className={styles.cellInfoContent}>
              <span>
                {experience ? (
                  experience.name
                ) : (
                  <HTText translationKey={'offer.view_all_experiences'} />
                )}
              </span>
            </div>
          </div>
          <img
            className={styles.cellImage}
            alt={
              experience
                ? experience.name
                : formatMessage({ id: 'offer.view_all_experiences' })
            }
            src={imageSrc}
          />
        </div>
      </HTLink>
    );
  };
}

export default injectIntl(HomeView);
