// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { Route, withRouter, Switch } from 'react-router';
import ReduxToastr from 'react-redux-toastr';
import qs from 'query-string';

import ScrollToTop from './ScrollToTop.js';
import HomePage from './HomePage';
import AboutUs from '../components/AboutUs/AboutUs';
import Career from '../components/Career/Career';
import TermsAndConditions from '../components/TermsAndConditions/TermsAndConditions';
import PrivacyPolicy from '../components/PrivacyPolicy/PrivacyPolicy';
import EmailVerificationSuccess from '../components/EmailVerification/EmailVerificationSuccess';
import EmailVerificationFail from '../components/EmailVerification/EmailVerificationFail';
import SignupPage from './SignupPage';
import CompleteSignupPage from './CompleteSignupPage';
import AccountPage from './AccountPage';
import UpdateProfilePage from './UpdateProfilePage';
import UpdatePasswordPage from './UpdatePasswordPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage';
import OffersPage from './OffersPage';
import OfferDetailPage from './OfferDetailPage';
import HotelGroupOffersPage from './HotelGroupOffersPage';
import PartnersPage from './PartnersPage';
import PressPage from './PressPage';
import PrivateRoute from './PrivateRoute';
import AccountRoute from './AccountRoute';
import PackageStep3 from './PackageStep3';
import SideMenu from '../components/SideMenu/SideMenu';
import AuthModal from '../components/AuthModal/AuthModal';
import UpdateCardModal from '../components/UpdateCardModal/UpdateCardModal';
import HTLoadingPage from '../components/HTLoadingPage/HTLoadingPage';
import BrowserWarningModal from '../components/BrowserWarningModal/BrowserWarningModal';
import RedirectToHomePage from '../components/RedirectToHomePage/RedirectToHomePage';
import { verifyRemindToastr } from '../components/VerifyRemindToastr/verifyRemindToaster';

import {
  oauthLogin,
  signin,
  setSignupInfo,
  setPartnerCode,
  whoami,
} from '../actions/auth';
import {
  setSideMenuState,
  openAuthModal,
  closeAuthModal,
  switchAuthModalMode,
  fetchServerState,
  fetchAllExperiences,
  changeCurrency,
  closeUpdateCardModal,
  resumeContext,
} from '../actions/app';
import { updateCard } from '../actions/account';
import { trackPageView } from '../utils/eventTracker';
import { browserSpecs } from '../utils/browser';
import { SUPPORTED_BROWSERS } from '../utils/constants';

import styles from '../styles/App.scss';

import type { IntlShape } from 'react-intl';
import type { Location } from 'react-router-dom';
import type { CreditCard } from '../models/CreditCard';
import type { Dispatch } from '../types/Dispatch';
import type { OauthProvider } from '../types';
import type { RootState } from '../states';
import type { AuthState } from '../states/auth';
import type { AccountState } from '../states/account';
import type { AppState } from '../states/app';

type Props = {
  intl: IntlShape,
  app: AppState,
  auth: AuthState,
  account: AccountState,
  actions: {
    signin: (email: string, password: string) => void,
    setSideMenuState: (isOpen: boolean) => void,
    oauthLogin: (provider: OauthProvider) => void,
    openAuthModal: ('signin' | 'signup') => void,
    closeAuthModal: () => void,
    switchAuthModalMode: ('signin' | 'signup') => void,
    closeUpdateCardModal: () => void,
    setSignupInfo: (string, ?string) => void,
    setPartnerCode: string => Promise<void>,
    changeCurrency: (currency: string) => void,
    push: string => void,
    fetchServerState: () => void,
    fetchAllExperiences: () => void,
    whoami: () => void,
    updateCard: CreditCard => void,
    resumeContext: () => void,
  },
  location: Location,
};

type LocalState = {
  isBrowserWarningOpen: boolean,
};

class App extends PureComponent<Props, LocalState> {
  constructor(props: Props) {
    super(props);

    this.state = { isBrowserWarningOpen: false };
  }

  closeBrowserWarning = () => {
    this.setState({ isBrowserWarningOpen: false });
  };

  componentWillMount() {
    // Fetch meta data for the whole app
    const {
      auth: { isLoggedIn },
      actions: {
        fetchServerState,
        fetchAllExperiences,
        whoami,
        setPartnerCode,
        setSignupInfo,
        openAuthModal,
      },
    } = this.props;
    fetchServerState();
    fetchAllExperiences();
    whoami();

    const browserSpecs_ = browserSpecs();
    // alert(JSON.stringify(browserSpecs_));
    if (
      Object.keys(SUPPORTED_BROWSERS).indexOf(browserSpecs_.name) >= 0 &&
      SUPPORTED_BROWSERS[browserSpecs_.name] >
        parseInt(browserSpecs_.version, 10)
    ) {
      this.setState({ isBrowserWarningOpen: true });
    }
    const email: ?string = qs.parse(window.location.search).email;
    const partnerCode: ?string = qs.parse(window.location.search).partnercode;
    if (email && !isLoggedIn) {
      setSignupInfo(email, '');
      if (!partnerCode) {
        openAuthModal('signup');
      }
    }
    if (partnerCode && !isLoggedIn) {
      setPartnerCode(partnerCode).then(() => {
        openAuthModal('signup');
      });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisUser = this.props.auth.user;
    const thisUserId = thisUser ? thisUser.id : null;
    const nextUser = nextProps.auth.user;
    const nextUserId = nextUser ? nextUser.id : null;
    if (
      thisUserId !== nextUserId &&
      nextUser &&
      nextUserId &&
      nextUser.signupCompleted &&
      !nextUser.verified
    ) {
      setTimeout(() => verifyRemindToastr(nextUser), 1000);
    }

    const currentPath = this.props.location.pathname;
    const nextPath = nextProps.location.pathname;
    if (currentPath !== nextPath) {
      trackPageView(nextPath);
    }
  }

  onUpdateLocation = () => {
    this.props.actions.closeAuthModal();
  };

  render() {
    const {
      app: { sideMenu: { isOpen }, config, serverStateRequest },
      auth,
      actions: {
        setSideMenuState,
        oauthLogin,
        switchAuthModalMode,
        openAuthModal,
        closeAuthModal,
        closeUpdateCardModal,
        changeCurrency,
        push,
        resumeContext,
      },
    } = this.props;

    const { isBrowserWarningOpen } = this.state;

    if (serverStateRequest.requesting) {
      return <HTLoadingPage />;
    }

    if (auth.whoamiRequest.requesting) {
      return <HTLoadingPage />;
    }

    if (!auth.user && auth.whoamiRequest.error == null) {
      return <HTLoadingPage />;
    }

    const isModalOpen = this.props.app.authModalConfig.isOpen;
    const isUpdateCardModalOpen = this.props.app.updateCardModalConfig.isOpen;

    return (
      <ScrollToTop onUpdateLocation={this.onUpdateLocation}>
        <div className={styles.wrapperStyle}>
          <ReduxToastr
            className={'ht-toastr'}
            newestOnTop={false}
            preventDuplicates
            position="bottom-center"
            transitionIn="fadeIn"
            transitionOut="fadeOut"
          />
          <SideMenu
            isOpen={isOpen}
            onStateChange={setSideMenuState}
            openAuthModal={openAuthModal}
            changeCurrency={changeCurrency}
            user={auth.user}
            appConfig={config}
            push={push}
          />
          <div className={styles.contentStyle}>
            <Switch>
              <Route path="/about" name="AboutUs" component={AboutUs} />
              <Route path="/career" name="Career" component={Career} />
              <Route path="/press" name="PressPage" component={PressPage} />
              <Route
                path="/tnc"
                name="TermsAndConditions"
                component={TermsAndConditions}
              />
              <Route
                path="/privacy-policy"
                name="PrivacyPolicy"
                component={PrivacyPolicy}
              />
              <Route
                path="/verify/success"
                name="EmailVerificationSuccess"
                component={EmailVerificationSuccess}
              />
              <Route
                path="/verify/fail"
                name="EmailVerificationFail"
                component={EmailVerificationFail}
              />
              <Route path="/signup" name="SignupPage" component={SignupPage} />
              <Route
                path="/forgot-password"
                name="ForgotPasswordPage"
                component={ForgotPasswordPage}
              />
              <Route
                path="/reset-password/:userID"
                name="ResetPasswordPage"
                component={ResetPasswordPage}
              />
              <Route
                path="/complete_signup"
                name="CompleteSignupPage"
                component={CompleteSignupPage}
              />
              <AccountRoute
                exact
                path="/account"
                name="AccountPage"
                component={AccountPage}
              />
              <AccountRoute
                exact
                path="/account/profile/update"
                name="UpdateProfilePage"
                component={UpdateProfilePage}
              />
              <AccountRoute
                exact
                path="/account/password/update"
                name="UpdatePasswordPage"
                component={UpdatePasswordPage}
              />
              <Route
                exact
                path="/all-offers"
                name="OffersPage"
                component={OffersPage}
              />
              <Route
                path="/all-offers/:experienceId"
                name="OffersPage"
                component={OffersPage}
              />
              <PrivateRoute
                exact
                path="/hotel/:hotelSlug/offer/:id"
                name="OfferDetailPage"
                component={OfferDetailPage}
              />
              <PrivateRoute
                exact
                path="/hotel/:hotelSlug/offer/:id/booking/1"
                name="OfferDetailOrderStep1Page"
                component={OfferDetailPage}
              />
              <PrivateRoute
                exact
                path="/hotel/:hotelSlug/offer/:id/booking/2"
                name="OfferDetailOrderStep2Page"
                component={OfferDetailPage}
              />
              <Route
                exact
                path="/order/:id"
                name="OfferDetailOrderStep3Page"
                component={PackageStep3}
              />
              <Route
                exact
                path="/partners/hotel/:slug"
                name="HotelGroupOffersPage"
                component={HotelGroupOffersPage}
              />
              <Route
                path="/partners"
                name="PartnersPage"
                component={PartnersPage}
              />
              <Route exact path="/" name="HomePage" component={HomePage} />
              <Route component={RedirectToHomePage} />
            </Switch>
          </div>
          {isModalOpen && (
            <AuthModal
              signinError={auth.signinRequest.error}
              isLoggedIn={auth.isLoggedIn}
              isLoading={auth.signinRequest.requesting}
              config={this.props.app.authModalConfig}
              switchMode={switchAuthModalMode}
              closeModal={closeAuthModal}
              signin={this.props.actions.signin}
              setSignupInfo={this.props.actions.setSignupInfo}
              push={this.props.actions.push}
              oauthLogin={oauthLogin}
              prefillEmail={auth.signupInfo.email}
              prefillPartnerCode={auth.signupInfo.partnerCode}
              resumeContext={resumeContext}
            />
          )}
          {auth.user && isUpdateCardModalOpen ? (
            <UpdateCardModal
              isOpen={isUpdateCardModalOpen}
              closeModal={closeUpdateCardModal}
              updateCard={this.props.actions.updateCard}
              updateCardRequest={this.props.account.updateCardRequest}
            />
          ) : null}
          {isBrowserWarningOpen && (
            <BrowserWarningModal
              isOpen={isBrowserWarningOpen}
              closeModal={this.closeBrowserWarning}
            />
          )}
        </div>
      </ScrollToTop>
    );
  }
}

function mapStateToProps({ app, auth, account }: RootState) {
  return {
    app,
    auth,
    account,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = {
    setSideMenuState,
    openAuthModal,
    closeAuthModal,
    closeUpdateCardModal,
    switchAuthModalMode,
    signin,
    setSignupInfo,
    setPartnerCode,
    oauthLogin,
    push,
    fetchServerState,
    fetchAllExperiences,
    whoami,
    changeCurrency,
    updateCard,
    resumeContext,
  };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(App))
);
