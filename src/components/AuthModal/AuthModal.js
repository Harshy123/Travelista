// @flow
import skygear from 'skygear';


import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import classNames from 'classnames';
import styles from './AuthModal.scss';
import foundation from '../../styles/foundation.scss';
import HTTextInput from '../HTForm/HTTextInput';
import closeIcon from '../../images/ic_close_thin.svg';
import facebookIcon from '../../images/ic_facebook.svg';
import googlePlusIcon from '../../images/ic_google_plus.svg';
// import instagramIcon from '../../images/ic_instagram.svg';
import submitIcon from '../../images/ic_submit.svg';
import htLogo from '../../images/heytravelista_logo_champagne.svg';
import HTButton from '../HTButton/HTButton';
import HTText from '../HTText/HTText';
import { injectIntl } from 'react-intl';
import { validateEmailFormat } from '../../utils/stringUtil';
// added values
import { validatePassword } from '../../utils/password';     
import { htmlLineBreak } from '../../utils/stringUtil';
import HTCheckBox from '../HTForm/HTCheckBox';
import { signup } from '../../actions/auth';
import type { UserInfo } from '../../models/UserInfo';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// End
import { ERR_INVALID_PARTNER_CODE } from '../../utils/apiError';
import { toastrError } from '../../utils/toastr';
import apiClient from '../../api';
import { mustBe } from '../../utils/utils';

import type { IntlShape } from 'react-intl';
import type { AuthModalConfig } from '../../states/app';
import type {
  OauthProvider,
  Request,
  EmailExistResponse,
  ApiError,
} from '../../types';

type Props = {
  intl: IntlShape,
  isLoading: boolean,
  isLoggedIn: boolean,
  signinError: ?string,
  config: AuthModalConfig,
  signin: (email: string, password: string) => void,
  setSignupInfo: (email: string, partnerCode: ?string) => void,
  oauthLogin: (provider: OauthProvider) => void,
  push: string => void,
  closeModal: () => void,
  switchMode: ('signin' | 'signup') => void,
  prefillEmail: ?string,
  prefillPartnerCode: ?string,
  resumeContext: () => void,
};

type State = {
  form: {
    email: ?string,
    password: ?string,
    confirmPassword?: string,                  // changed
    receivePromotion: boolean,                 // changed
    accept: ?boolean,                         // changed
    partnerCode: ?string,
  },
  checkEmailRequest: Request,
  errorReasons: {
    email:
      | null
      | 'auth_modal.invalid.required'
      | 'auth_modal.invalid.email.email_format'
      | 'auth_modal.invalid.email.duplicated',
    password: null | 'auth_modal.invalid.required',
    confirmPassword: null | 'auth_modal.invalid.required',
    partnerCode: null | 'auth_modal.invalid.partner_code',
  },
};
class AuthModal extends PureComponent<Props, State> {
  static contextTypes = {
    intl: PropTypes.any,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        email: props.prefillEmail || '',
        password: null,
        confirmPassword: null,                                        //changed
        receivePromotion: false,                                      //changed
          accept: false,                                              //changed
        partnerCode: props.prefillPartnerCode || null,
      },
      errorReasons: {
        email: null,
        password: null,
        confirmPassword: null,                                       //changed
        accept: null,                                                //changed
        partnerCode: null,
      },
      checkEmailRequest: {
        requesting: false,
        error: null,
      },
    };
  }

  componentWillMount() {
    const { isLoggedIn, closeModal } = this.props;
    if (isLoggedIn) {
      closeModal();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisSigninError = this.props.signinError;
    const nextSigninError = nextProps.signinError;
    const thisIsLoggedIn = this.props.isLoggedIn;
    const nextIsLoggedIn = nextProps.isLoggedIn;
    const { intl: { formatMessage } } = this.props;
    if (thisSigninError == null && nextSigninError != null) {
      const error = nextSigninError;
      toastrError(formatMessage({ id: error }));
    }

    if (thisIsLoggedIn !== nextIsLoggedIn && nextIsLoggedIn) {
      this.props.resumeContext();
      this.props.closeModal();
    }
  }

  onClickSwitchMode = () => {
    this.setState((state: State) => ({
      errorReasons: {
        ...state.errorReasons,
        email: null,
        password: null,
        confirmPassword: null,                             // changed
      },
    }));

    const { mode } = this.props.config;
    if (mode === 'signin') this.props.switchMode('signup');
    else this.props.switchMode('signin');
  };

  onRequestClose = () => {
    this.props.closeModal();
  };

  onEmailChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        email: value,
      },
    }));
  };

  onPasswordChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        password: value,
      },
    }));
  };

  onPartnerCodeChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        partnerCode: value,
      },
    }));
  };

  onConfirmpasswordChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        confirmPassword: value,
      },
    }));
  };

  onCheckBoxChange = (key: string) => (checked: boolean) => {              //added function 
    this.setState((state: State) => ({
      form: {
        ...state.form,
        [key]: checked,
      },
    }));
  };

  onClickSubmit = async (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { config: { mode } } = this.props;
    const { email, password, partnerCode, confirmPassword, receivePromotion, accept } = this.state.form;         // confirmPassword Added

    if (await this.validateForm()) {
      const emailUW: string = mustBe(email);
      if (mode === 'signin') {
        const passwordUW = mustBe(password);
        this.props.signin(emailUW, passwordUW);
      } else {
        // this.props.setSignupInfo(emailUW, partnerCode);       // just to update the reducer with signup details
        // this.props.push('/signup');
        // apiClient.recordSignup(emailUW, partnerCode);          // calling some api in backend


        //   skygear.auth
        // .signupWithEmail(emailUW, password)
        // .then((response) => {
        //   debugger;
        //   console.log("Data Saved")
        // }, (error) => {
        //   debugger;
        // })
        console.log("Cleared all validations");

        const userInfo: UserInfo = {
          email: emailUW,
          passportName: '',
          firstName: emailUW,
          lastName: '',
          mobileNumber: null,
          defaultCurrency: null,
          salutation: 'mr',
          countryOfResidence: null,
          receivePromotion,
          partnerCode,
        };
        this.props.actions.signup(emailUW, mustBe(password), userInfo);
      }
    }
  };

  validateForm: () => Promise<boolean> = async () => {
    const { config: { mode }, intl: { formatMessage } } = this.props;
    const { email, password, partnerCode,
       confirmPassword,         // added Confirm password
      receivePromotion,
      accept,
    } = this.state.form;         
    let isValid: boolean = true;
    let emailErrorReason:
      | null
      | 'auth_modal.invalid.required'
      | 'auth_modal.invalid.email.duplicated'
      | 'auth_modal.invalid.email.email_format' = null;
    let passwordErrorReason: null | 'auth_modal.invalid.required' = null;
    let confirmPasswordErrorReason: null | 'auth_modal.invalid.required' = null;               //Changed
    let partnerCodeErrorReason: null | 'auth_modal.invalid.partner_code' = null;
    let receivePromotionErrorReason: null | 'signup.accept_email.error' = null;                // added for radio buttons
    let acceptErrorReason: null | 'signup.accept.error' = null;                                // added for radio buttons

    if (email == null || email.length === 0) {
      isValid = false;
      emailErrorReason = 'auth_modal.invalid.required';
    } else {
      if (validateEmailFormat(email)) {
        emailErrorReason = null;
      } else {
        isValid = false;
        emailErrorReason = 'auth_modal.invalid.email.email_format';
      }
    }

    if (mode === 'signin') {
      if (password == null || password.length === 0) {
        isValid = false;
        passwordErrorReason = 'auth_modal.invalid.required';
      } else {
        // add more password validation
        passwordErrorReason = null;
      }
    } else {
      // added code for password and confirm password if and else statements
      if (password == null || password.length === 0) {
        isValid = false;
        passwordErrorReason = 'auth_modal.invalid.required';
      } else {
        const passwordError = validatePassword(password);
        if (passwordError) {
          isValid = false;
          passwordErrorReason = formatMessage({ id: passwordError });
        } else {
          passwordErrorReason = null;
        }
      }
      if (confirmPassword == null || confirmPassword.length === 0) {
        isValid = false;
        confirmPasswordErrorReason = 'auth_modal.invalid.required';
      } else {
        if (password !== confirmPassword) {
          isValid = false;
          confirmPasswordErrorReason = formatMessage({
            id: 'signup.form.password_not_match',
          });
        } else {
          confirmPasswordErrorReason = null;
        }
      }
      // added for radio buttons
      if (!receivePromotion) {
        isValid = false;
        receivePromotionErrorReason = 'signup.accept_email.error';
        toastrError(
          formatMessage({
            id: receivePromotionErrorReason,
          })
        );
      } else {
        receivePromotionErrorReason = null;
      }

      if (!accept) {
        isValid = false;
        acceptErrorReason = `signup.accept.error`;
        toastrError(
          formatMessage({
            id: acceptErrorReason,
          })
        );
      } else {
        acceptErrorReason = null;
      }


      await Promise.all([
        email ? apiClient.checkEmailExist(email) : true,
        partnerCode ? _validatePartnerCode(partnerCode) : true
      ])
        // eslint-disable-next-line flowtype/no-weak-types
        .then((responses: any) => {
          const emailExistResponse: EmailExistResponse = responses[0];
          const partnerCodeValid: boolean = responses[1];

          if (emailExistResponse.exist) {
            //isValid = false;
            emailErrorReason = 'auth_modal.invalid.email.duplicated';
          }

          if (!partnerCodeValid) {
            //isValid = false;
            partnerCodeErrorReason = 'auth_modal.invalid.partner_code';
          }
        })
        .catch((error: ApiError) => {
          toastrError(formatMessage({ id: error.message }));
        });
    }

    this.setState((state: State) => ({
      errorReasons: {
        ...state.errorReasons,
        email: emailErrorReason,
        password: passwordErrorReason,
        confirmPassword: confirmPasswordErrorReason,             // changed for confirm password
        partnerCode: partnerCodeErrorReason,
        // added for radio buttons
        accept: acceptErrorReason,
      },
    }));

    return isValid;
  };

  facebookLogin = () => {
    this.props.oauthLogin('facebook');
  };

  googleLogin = () => {
    this.props.oauthLogin('google');
  };

  instagramLogin = () => {
    this.props.oauthLogin('instagram');
  };

  render() {
    const {
      isLoading,
      config: { isOpen, mode },
      intl: { formatMessage },
    } = this.props;
    const emailErrorReason = this.state.errorReasons.email;
    const passwordErrorReason = this.state.errorReasons.password;
    const partnerCodeErrorReason = this.state.errorReasons.partnerCode;
    const confirmPasswordErrorReason = this.state.errorReasons.confirmPassword;          // added for confirm password

    const viewConfig =
      mode === 'signup'
        ? {
            title: 'auth_modal.signup',
            blank: 'auth_modal.signup_blank',
            signinControlClassName: foundation['invisible'],
          }
        : {
            title: 'auth_modal.login',
            blank: 'auth_modal.login_blank',
            signinControlClassName: '',
          };

    return (
      <Modal
        isOpen={isOpen}
        className={styles.modal}
        onRequestClose={this.onRequestClose}
        overlayClassName={styles.overlay}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        ariaHideApp={false}
        shouldReturnFocusAfterClose={false}
      >
        <div
          className={classNames(foundation['grid-container'], styles.wrapper)}
        >
          <section className={styles.modalHeader}>
            <div
              className={classNames(
                styles.title,
                foundation['show-for-small-only']
              )}
            >
              <HTText translationKey={viewConfig.title} />
            </div>
            <img className={styles.htLogo} src={htLogo} alt="heytravelista" />
            <div className={styles.blurb}>
              <HTText
                translationKey="auth_modal.blurb"
                values={{
                  mode: this.context.intl.formatMessage({
                    id: viewConfig.blank,
                  }),
                }}
              />
            </div>
            <button
              onClick={this.onRequestClose}
              className={styles.closeIconContainer}
            >
              <img
                alt={formatMessage({ id: 'image.modal.close' })}
                src={closeIcon}
                className={styles.closeIcon}
              />
            </button>
          </section>
          <section className={styles.content}>
            <div className={styles.socialMedia}>
              <img
                alt={formatMessage({
                  id: 'image.social_media.facebook',
                })}
                src={facebookIcon}
                className={styles.socialMediaIcon}
                onClick={this.facebookLogin}
              />
              {/* <img
                alt={formatMessage({
                  id: 'image.social_media.instagram',
                })}
                src={instagramIcon}
                className={styles.socialMediaIcon}
                onClick={this.instagramLogin}
              /> */}
              <img
                alt={formatMessage({
                  id: 'image.social_media.google',
                })}
                src={googlePlusIcon}
                className={styles.socialMediaIcon}
                onClick={this.googleLogin}
              />
            </div>
            <form className={styles.form}>
              <div className={styles.inputFields}>
                <div className={classNames(foundation['grid-x'])}>
                  <div
                    className={classNames(
                      foundation['small-12'],
                      foundation['medium-6']
                    )}
                  >
                    <div className={styles.formControl}>
                      <HTTextInput
                        isError={emailErrorReason != null}
                        errorMessage={
                          emailErrorReason &&
                          formatMessage({ id: emailErrorReason || 'invalid' })
                        }
                        onChange={this.onEmailChange}
                        defaultValue={this.state.form.email || ''}
                        placeholder={formatMessage({ id: 'auth_modal.email' })}
                        placeholderHint={
                          this.state.form.email &&
                          formatMessage({ id: 'auth_modal.email' })
                        }
                      />
                      {/* Added Code */}
                      {(mode === 'signin')?(null):
                      <div>
                      <br />
                      <HTTextInput
                      isError={passwordErrorReason != null}
                      errorMessage={
                        passwordErrorReason &&
                        formatMessage({
                          id: passwordErrorReason || 'invalid',
                        })
                      }
                      onChange={this.onPasswordChange}
                      value={this.state.form.password || ''}
                      type={'password'}
                      placeholder={formatMessage({
                        id: 'signup.form.password',
                      })}
                      placeholderHint={
                        this.state.form.password
                          ? formatMessage({
                              id: 'signup.form.password',
                            })
                          : ''
                      }
                    />
                    </div>
                      }

                    </div>
                  </div>
                  <div
                    className={classNames(
                      foundation['small-12'],
                      foundation['medium-6']
                    )}
                  >
                    <div className={styles.formControl}>
                      {mode === 'signin' ? (
                        <HTTextInput
                          isError={passwordErrorReason != null}
                          errorMessage={
                            passwordErrorReason &&
                            formatMessage({
                              id: passwordErrorReason || 'invalid',
                            })
                          }
                          onChange={this.onPasswordChange}
                          value={this.state.form.password || ''}
                          type={'password'}
                          placeholder={formatMessage({
                            id: 'auth_modal.login_password',
                          })}
                          placeholderHint={
                            this.state.form.password
                              ? formatMessage({
                                  id: 'auth_modal.login_password',
                                })
                              : ''
                          }
                        />
                      ) : (
                        <div>
                        <HTTextInput
                          isError={partnerCodeErrorReason != null}
                          errorMessage={
                            partnerCodeErrorReason &&
                            formatMessage({
                              id: partnerCodeErrorReason || 'invald',
                            })
                          }
                          onChange={this.onPartnerCodeChange}
                          value={this.state.form.partnerCode || ''}
                          placeholder={formatMessage({
                            id: 'auth_modal.partner_code',
                          })}
                          placeholderHint={
                            this.state.form.partnerCode
                              ? formatMessage({ id: 'auth_modal.partner_code' })
                              : ''
                          }
                        />
                         {/* Added Code from div */}
                        <br/>
                        <HTTextInput
                      isError={confirmPasswordErrorReason != null}
                      errorMessage={
                        confirmPasswordErrorReason &&
                        formatMessage({
                          id: confirmPasswordErrorReason || 'invalid',
                        })
                      }
                      onChange={this.onConfirmpasswordChange}
                      value={this.state.form.confirmPassword || ''}
                      type={'password'}
                      placeholder={formatMessage({
                        id: 'signup.form.confirm_password',
                      })}
                      placeholderHint={
                        this.state.form.password
                          ? formatMessage({
                              id: 'signup.form.confirm_password',
                            })
                          : ''
                      }
                    />
                     
                    {/* End of Sign In div code */}
                      </div>

                      )}
                    </div>
                    
                  </div>

                      {
                      (mode === 'signin') ? (null) : (
                        <div>
                          {/* Start of radio buttons div */}
                        <div className={styles.formControl}>
                        <label className={styles.checkboxLabel}>
                          <HTCheckBox
                            id="accept_terms"
                            onChange={this.onCheckBoxChange('accept')}
                          />
                          <span className={styles.checkboxText}>
                            <HTText
                              translationKey="signup.form.accept_terms"
                              values={{
                                tnc: (
                                  <a href="/tnc" target="_blank" className={styles.link}>
                                    <HTText translationKey="footer.tnc" />
                                  </a>
                                ),
                                pp: (
                                  <a
                                    href="/privacy-policy"
                                    target="_blank"
                                    className={styles.link}
                                  >
                                    <HTText translationKey="footer.privacy_policy" />
                                  </a>
                                ),
                              }}
                            />
                          </span>
                        </label>
                      </div>

                      <div className={styles.formControl}>
                        <label className={styles.checkboxLabel}>
                          <HTCheckBox
                            id="accept_promotion"
                            value={this.state.form.receivePromotion}
                            onChange={this.onCheckBoxChange('receivePromotion')}
                          />
                          <span className={styles.checkboxText}>
                            {htmlLineBreak(
                              formatMessage({ id: 'signup.form.accept_promotion' })
                            )}
                          </span>
                        </label>
                      </div>
                            {/* End of radio button div */}
                    </div>
                      )
                    }

                </div>
                <div
                  className={classNames(
                    foundation['grid-x'],
                    viewConfig.signinControlClassName
                  )}
                >
                  <div
                    className={classNames(
                      foundation['small-6'],
                      foundation['medium-6'],
                      styles.signinAddition
                    )}
                  />
                  <div
                    className={classNames(
                      foundation['small-6'],
                      foundation['medium-6'],
                      styles.signinAddition
                    )}
                  >
                    <Link to="/forgot-password">
                      <HTText translationKey="auth_modal.forgot_password" />
                    </Link>
                  </div>
                </div>
              </div>
              {!isLoading ? (
                <button
                  className={styles.submitButton}
                  onClick={this.onClickSubmit}
                >
                  <img
                    alt={formatMessage({ id: 'image.modal.submit' })}
                    src={submitIcon}
                    className={styles.submitIcon}
                  />
                </button>
              ) : (
                <span>Loading </span>
              )}
            </form>
            <HTButton
              className={styles.switchButton}
              buttonType={'hollowChampagne'}
              text={
                mode === 'signin'
                  ? formatMessage({ id: 'auth_modal.switch_to_signup' })
                  : formatMessage({ id: 'auth_modal.switch_to_signin' })
              }
              contentClassName={styles.buttonContent}
              onClick={this.onClickSwitchMode}
            />
          </section>
        </div>
      </Modal>
    );
  }
}

function _validatePartnerCode(partnerCode: string): Promise<boolean> {
  return apiClient.validatePartnerCode(partnerCode).then(
    () => {
      return true;
    },
    (error: ApiError) => {
      if (error.code === ERR_INVALID_PARTNER_CODE) {
        return false;
      }

      throw error;
    }
  );
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = {
    signup
  };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(null, mapDispatchToProps)(injectIntl(AuthModal))
