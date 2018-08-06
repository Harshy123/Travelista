// @flow

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './PrivacyPolicy.scss';
import foundation from '../../styles/foundation.scss';
import Navigation from '../../containers/Navigation';
import HTText from '../HTText/HTText';
import HTPageTitle from '../HTPageTitle/HTPageTitle';
import { injectFooter } from '../../utils/utils';

type Props = {};

class PrivacyPolicy extends PureComponent<Props> {
  render() {
    return (
      <div>
        <HTPageTitle translationKey="page.title.privacy_policy" />
        <Navigation />

        <section className={styles.privacyPolicyHeader}>
          <div
            className={classNames(
              foundation['grid-container'],
              styles.privacyPolicyHeaderWrapper
            )}
          >
            <h2 className={styles.title}>
              <HTText translationKey={'privacy_policy.title'} />
            </h2>
          </div>
        </section>

        <article
          className={classNames(
            styles.privacyPolicyArticle,
            foundation['grid-container']
          )}
        >
          <p>
            <strong>IMPORTANT</strong>: Hey Travelista Limited (“Hey
            Travelista”) is committed to protecting and respecting the privacy
            of any person taking advantage of the services offered by Hey
            Travelista (and all other persons (if any) included with that person
            in the booking) (“you”, “your” or “Travelista”).
            <br />
            <br />
            This Hey Travelista Privacy Policy (“Privacy Policy”) (together with
            the Hey Travelista <Link to="/tnc">Terms and Conditions</Link> (“Hey
            Travelista Terms and Conditions”)) and any other documents referred
            to therein) sets out the policies and practices of which any
            information including Personal Data collected by Hey Travelista
            and/or provided by you, will be processed by Hey Travelista (also
            referred to as “we”, “us” or “our”).
            <br />
            <br />
            You should read the following carefully to understand Hey
            Travelista’s views and practices regarding your Personal Data and
            how Hey Travelista will treat and protect it in accordance with the
            provisions of the Personal Data (Privacy) Ordinance (Cap.486)
            (“Ordinance”) and in certain circumstances the General Data
            Protection Regulation (GDPR) (EU) 2016/679 ("GDPR") together (“Data
            Protection Legislation”).
            <br />
            <br />
            Pursuant to the Data Protection Legislation, Hey Travelista is a
            data controller.
            <br />
            <br />
            In this Privacy Policy
            <br />
            <br />
            “Personal Data” refers to information (a) which relates directly or
            indirectly to a living individual; (b) from which it is practicable
            for the identity of the individual to be directly or indirectly
            ascertained; and (c) in forms which access to or processing of the
            data is practicable.
            <br />
            <br />
            “Hey Travelista Mobile Application” refers to the mobile application
            service or services provided by Hey Travelista for you.
            <br />
            <br />
            “Hey Travelista Website” refers to{' '}
            <a href="https://www.heytravelista.com">
              https://www.heytravelista.com
            </a>{' '}
            and any other domain as may be adopted by Hey Travelista from time
            to time.
            <br />
            <br />
            “Merchant” refers to a third-party merchant who offers travel
            products as a principal and who has entered into a participation
            contract with Hey Travelista.
            <br />
            <br />
            “Partner” refers to a business with whom Hey Travelista has
            arrangements for Travelistas to purchase their services and/or
            purchasing the goods from such business. Partners and the relevant
            information of each Partner will vary from time to time, details of
            which are available on the Hey Travelista Website and the Hey
            Travelista Mobile Application.
            <br />
            <br />
            “Supplier” refers to any individual, business entity or professional
            body for which Hey Travelista has no direct ownership in, which
            provides relevant products and services, with or without fees, to
            support the operation, legal, marketing, communication and other
            essential business functions of Hey Travelista.
            <br />
            <br />
            In this Privacy Policy:
            <br />
            <br />
            a) words denoting one gender shall include the other gender and the
            neuter and vice versa, and words denoting the singular number shall
            include the plural number and vice versa; and
            <br />
            <br />
            b) the headings and captions used herein are inserted for
            convenience of reference only and shall not affect its
            interpretation.
          </p>

          <h4>Contents</h4>
          <ol>
            <li>
              <a href="#personal-information-collection">
                Collection of your Personal Information
              </a>
            </li>
            <li>
              <a href="#cookies">Cookies</a>
            </li>
            <li>
              <a href="#personal-data-retention">Retention of Personal Data</a>
            </li>
            <li>
              <a href="#personal-data-purposes">
                Purposes for Collection and Use of Your Personal Data
              </a>
            </li>
            <li>
              <a href="#personal-information-security">
                Security of Your Personal Information
              </a>
            </li>
            <li>
              <a href="#consent">
                Consent (excluding individuals located in the EU)
              </a>
            </li>
            <li>
              <a href="#legal-basis">
                Legal Basis for Processing (individuals located in the EU only)
              </a>
            </li>
            <li>
              <a href="#privacy-policy-change">Changes to Privacy Policy</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ol>

          <h3 id="personal-information-collection">
            1. Collection of your Personal Information
          </h3>
          <ul>
            <li>
              <span>1.1</span>We may request you to provide or we will otherwise
              collect the following categories of personal information that may
              be used to verify your identification at a later time:
              <ul>
                <li>
                  <span>a)</span>
                  <strong>Website and app login details:</strong> when you
                  register with us we will maintain a record of your username
                  and password that you will use to access the Hey Travelista
                  Website and the Hey Travelista Mobile Application;
                </li>
                <li>
                  <span>b)</span>
                  <strong>Comments and opinions:</strong> when you contact us
                  directly including by email, phone, post or by completing an
                  online form we will record the correspondence in its hardcopy
                  or digital format;
                </li>
                <li>
                  <span>c)</span>
                  <strong>Contact details:</strong> we collect contact
                  information such as your name, your email address, your
                  telephone number and physical addresses associated with your
                  account or any bookings your place using our service;
                </li>
                <li>
                  <span>d)</span>
                  <strong>Your account and/or reservations:</strong> and/or
                  transactional activities including the transacted goods and
                  services, transaction activities, and order fulfillment
                  details;
                </li>
                <li>
                  <span>e)</span>
                  <strong>Information about how you use and connect:</strong> to
                  Hey Travelista Website and the Hey Travelista Mobile
                  Application including your traffic data including how long you
                  use it and when you log in, cookies, location data;
                </li>
                <li>
                  <span>f)</span>
                  <strong>Survey and research information:</strong> collected
                  from you by online or offline channels;
                </li>
                <li>
                  <span>g)</span>
                  <strong>Booking Information:</strong> we may need information
                  to process a booking including your name, date of birth,
                  gender, racial or ethnic region, contact information, personal
                  identity card number, passport number, travel document number,
                  billing information, business information, information about
                  your registered status with any of our subsidiaries,
                  associated companies and business associates.
                </li>
              </ul>
            </li>
            <li>
              <span>1.2</span>Supply of Personal Data to us is non-obligatory,
              but failure to do so may result in us being unable to process your
              registration or to provide facilities and services to you.
            </li>
          </ul>

          <h3 id="cookies">2. Cookies</h3>
          <ul>
            <li>
              <span>2.1</span>Cookies are text files containing small amounts of
              information which are downloaded to your device when you visit a
              website or use an online application.
            </li>
            <li>
              <span>2.2</span>Cookies are used on all Hey Travelista online
              tools available to you, including, without limitation, the Hey
              Travelista Website and the Hey Travelista Mobile Application: to
              distinguish you from other online users, to better serve and/or
              maintain your information online across multiple pages within or
              across one or more sessions, to track your online activities and
              to allow the Hey Travelista Website to be improved continuously.
            </li>
            <li>
              <span>2.3</span>Most web browsers are initially set up to accept
              cookies. You may choose to edit your browser options to block
              cookies in the future. If you block all cookies, certain features
              on the Hey Travelista Website may not work properly.
            </li>
            <li>
              <span>2.4</span>The use of any information we collected through
              the use of cookies shall be subject to this Privacy Policy.
            </li>
          </ul>

          <h3 id="personal-data-retention">3. Retention of Personal Data</h3>
          <ul>
            <li>
              <span>3.1</span>Personal Data provided by you will be retained for
              such period as may be necessary for carrying out the purposes
              stated in this Privacy Policy and in any event, for as long as
              required by the applicable law.
            </li>
            <li>
              <span>3.2</span>Where we process registration data, we do this for
              as long as you are an active user of the Hey Travelista Website /
              Hey Travelista Mobile Application and for a period of time after
              this.
            </li>
            <li>
              <span>3.3</span>Where we process personal data in connection with
              performing a contract (i.e. a booking you have made) we keep the
              data for up to 6 years from your last interaction with us. This
              includes any correspondence that you have had with our customer
              services team, so that we may resolve any complaints or claims
              that are made.
            </li>
            <li>
              <span>3.4</span>Unless otherwise agreed, hard copies of any
              documents containing Personal Data that you have provided to us
              become our property and we will destroy any documents in
              possession in accordance with the applicable law.
            </li>
            <li>
              <span>3.5</span>Upon the death of a Travelista, the Personal Data
              of the deceased will not be retained unless otherwise necessary
              for carrying out the purposes stated in this Privacy Policy to the
              extent required or permitted by law.
            </li>
          </ul>

          <h3>Storing and transferring your personal information</h3>
          <ul>
            <li>
              <span>3.6</span>Personal Data collected by us in order to carry
              out the purposes or directly related purposes stated in this
              Privacy Policy may be transferred to, and stored at, a destination
              outside the principal location(s) where we operate.
            </li>
            <li>
              <span>3.7</span>It may also be processed by our staff operating
              outside our principal location who work for us or for one of our
              Suppliers or for one of our Merchants. Such staff may be engaged
              in, among other things, the fulfilment of your orders, and the
              provision of support services. We shall take all steps reasonably
              necessary to ensure that your Personal Data is treated securely
              and in accordance with this Privacy Policy. Where such a transfer
              is performed, it will be done in compliance with the requirements
              of the Data Protection Legislation in effect e.g. subject to
              contractual protection.
            </li>
          </ul>

          <h3 id="personal-data-purposes">
            4. Purposes for Collection and Use of Your Personal Data
          </h3>
          <ul>
            <li>
              <span>4.1</span>The purpose for which your Personal Data may be
              and/or is used by us include in the following ways:
              <ul>
                <li>
                  <span>a)</span>To process and administer your registration to
                  become a Travelista;
                </li>
                <li>
                  <span>b)</span>To fulfill and process requests submitted by
                  you and Travelistas for any services offered by us;
                </li>
                <li>
                  <span>c)</span>To provide and maintain the Hey Travelista
                  Website, the Hey Travelista Mobile Application, or any of our
                  other services to you and Travelistas;
                </li>
                <li>
                  <span>d)</span>To improve the Hey Travelista Website and the
                  Hey Travelista Mobile Application, including, without
                  limitation, to address Travelistas’ queries and notify you and
                  Travelistas of any proposed or actual changes to our website,
                  our applications and the Hey Travelista Terms and Conditions;
                </li>
                <li>
                  <span>e)</span>To compile and provide anonymous statistics
                  about users of the Hey Travelista Website and the Hey
                  Travelista Mobile Application, and to provide related usage
                  information to reputable third parties, which will not in any
                  event enable any third party to identify individuals;
                </li>
                <li>
                  <span>f)</span>To provide and/or market the goods and/or
                  services provided by us and/or the Merchants (as defined in
                  the Hey Travelista Terms and Conditions) to you and
                  Travelistas;
                </li>
                <li>
                  <span>g)</span>To manage the relationship between you and Hey
                  Travelista;
                </li>
                <li>
                  <span>h)</span>To facilitate our business operations across
                  our group of companies including the fulfillment of any legal
                  requirements;
                </li>
                <li>
                  <span>i)</span>To use Travelista’s account activities to
                  evaluate, develop, offer and promote goods and/or services
                  provided by us and/or the Merchants to Travelistas; and
                </li>
                <li>
                  <span>j)</span>To provide location services to the
                  Travelistas.
                </li>
              </ul>
            </li>
            <li>
              <span>4.2</span>We and/or the Merchants intend to use your
              Personal Data to conduct direct marketing via email, push message,
              direct mail, telephone, fax and/or other form of communication,
              and to provide you and Travelistas with information about goods
              and/or services which are a part of services offered to you and
              Travelistas.
            </li>
            <li>
              <span>4.3</span>For the above direct marketing use, your Personal
              Data held by us may be provided to the Merchants. The intended
              kinds of Personal Data to be used are all kinds of your Personal
              Data which necessarily enable us to establish contact with you,
              and to market or promote a variety of our services, facilities and
              related goods and/or services offered by us and/or by our
              Partners. However, we shall not use or provide your Personal Data
              unless exempted by the Ordinance in effect or we have received
              your consent.
            </li>
            <li>
              <span>4.4</span>Your consent to the use of your Personal Data for
              the direct marketing use as indicated above can be given in the
              following ways:
              <ul>
                <li>
                  <span>a)</span>You may indicate your consent to the above by
                  the following ways: ticking the box(es) indicating your
                  consent when providing us with your Personal Data through our
                  website, indicating your consent to our customer
                  representative when providing us with your Personal Data
                  through telephone; or agreeing to the Terms of Use of the Hey
                  Travelista Mobile Application.
                </li>
                <li>
                  <span>b)</span>You may opt-out from receiving marketing
                  communications at any time, free of charge, by the following
                  ways: following the “opt-out” instructions contained in the
                  marketing communications; or writing to us at the address
                  listed below under section 9 – “Contact”; or updating your
                  marketing communications preference at the Hey Travelista
                  Website.
                </li>
              </ul>
            </li>
          </ul>

          <h3 id="personal-information-security">
            5. Security of Your Personal Information
          </h3>
          <ul>
            <li>
              <span>5.1</span>You hold the sole responsibility of safeguarding
              your own login and password information for your Hey Travelista
              account and such should not be disclosed to any third parties. We,
              our representatives or our affiliates or Partners, shall not ask
              you for your password under any circumstances. The risks of the
              leakage of your Personal Data or Hey Travelista fraudulent
              purchases resulting from your loss of the login and password
              information lie solely with you.
            </li>
            <li>
              <span>5.2</span>You acknowledge and understand that the
              transmission of information via the internet is not completely
              secure. Although we have taken practical steps to safeguard your
              Personal Data (including implementing appropriate technical and
              organisation measures) to prevent unauthorised access, and have
              implemented high standard security measures to protect any
              information received, we do not guarantee the security of your
              Personal Data transmitted to the Hey Travelista Website or the Hey
              Travelista Mobile Application, and you acknowledge and accept that
              any transmission is at your own risk.
            </li>
          </ul>
          <h3 id="personal-data-disclosure">
            Disclosure of Your Personal Data
          </h3>
          <ul>
            <li>
              <span>5.3</span>We may share your Personal Data with our Merchants
              and/or Partners who provide services to assist in fulfilling the
              purposes, or directly related purposes for which the Personal Data
              was collected, or as required under the relevant laws.
            </li>
            <li>
              <span>5.4</span>You agree to update your Personal Data from time
              to time so that it remains accurate.
            </li>
            <li>
              <span>5.5</span>Our Partners may disclose your Personal Data
              registered with such Partner to Hey Travelista, whether such
              Personal Data has been previously provided to us or not.
            </li>
            <li>
              <span>5.6</span>In addition we may share your information with
              companies in the same group of companies as Hey Travelista,
              service providers and advisors, buyers or prospective buyers of
              Hey Travelista as well as law enforcement agencies, regulators and
              other parties where we are under a legal obligation do so.
            </li>
          </ul>

          <h3 id="consent">
            6. Consent (excluding individuals located in the EU)
          </h3>
          <ul>
            <li>
              <span>6.1</span>By using services provided by us and/or the Hey
              Travelista Website/the Hey Travelista Mobile Application or by
              providing any Personal Data to us via registration or notification
              to Hey Travelista, you consent to the collection and/or use of
              your Personal Data as stated in this Privacy Policy and as set out
              elsewhere in any legal notices. You should not provide us any
              Personal Data if you do not consent to such collection and/or use.
            </li>
          </ul>

          <h3 id="legal-basis">
            7. Legal Basis for Processing (individuals located in the EU only)
          </h3>
          <ul>
            <li>
              <span>7.1</span>Our processing of your personal information is
              necessary: (a) for the performance of contracts to which you will
              be a party to and in order to take steps at your request prior to
              you entering into those contracts; (b) for the purposes of
              legitimate interests pursued by us; or (c) in order to comply with
              a legal obligation to which we are subject to.
            </li>
            <li>
              <span>7.2</span>Where our processing is based on the legitimate
              interest grounds described above, those legitimate interests are:
              (a) collecting personal information to provide you with a smooth
              and efficient customer experience; (b) running our business; (c)
              to provide the products and services you have requested; (d) to
              prevent fraud; (e) for the purposes described in this Privacy
              Policy; and (f) for our own marketing, research and product
              development.
            </li>
          </ul>
          <h3 id="your-right">Your Rights</h3>
          <ul>
            <li>
              <span>7.3</span>You may request to access and to correct your
              Personal Data held by us. If you wish to obtain a copy of any of
              such Personal Data, or if you believe that such Personal Data is
              incorrect, or if you believe that such Personal Data was used
              beyond the scope of the purposes or directly related purposes as
              stated in this Privacy Policy or was acquired by fraudulent or
              unlawful means, please write to us at the address listed below
              under section 9 – “Contact”.
            </li>
            <li>
              <span>7.4</span>A request for access or correction to, or deletion
              of Personal Data, or to obtain copies of this Privacy Policy and
              the Hey Travelista Terms and Conditions must be in writing and
              send to us at the address listed below under section 9 –
              “Contact”.
            </li>
            <li>
              <span>7.5</span>If at any time you withdraw your consent to be
              bound by this Privacy Policy and/or the Hey Travelista Terms and
              Conditions, you should immediately notify us in writing and send
              to us attention to "Chief Officer – Hey Travelista” at{' '}
              <a href="mailto:Hello@HeyTravelista.com">
                Hello@HeyTravelista.com
              </a>{' '}
              (non EU residents only).
            </li>
            <li>
              <span>7.6</span>You are required to include the full name,
              applicable identity information, contact number, and email address
              in all correspondence.
            </li>
            <li>
              <span>7.7</span>All Personal Data is handled in accordance with
              the Ordinance (or the GDPR as applicable) in effect. Should any
              provision of this Privacy Policy stipulated herein be found by any
              court or administrative body of competent jurisdiction to be
              invalid or unenforceable, the invalidity or unenforceability of
              such provision shall not affect the other provisions of this
              Privacy Policy. All provisions not affected by such invalidity or
              unenforceability shall remain in full force and effect.
            </li>
            <li>
              <span>7.8</span>Additionally if you are an individual located in
              the EU, you have the following additional rights: (i) to ask us to
              delete your information, if you consider that we do not have the
              right to hold it; (ii) to restrict processing of your information;
              (iii) to data portability (moving some of your information
              elsewhere) in certain circumstances; (iv) object to your
              information being processed in certain circumstances; (v) to not
              to be subject to a decision based on automated processing and to
              have safeguards put in place if you are being profiled based on
              your information.
            </li>
            <li>
              <span>7.9</span>If you wish to exercise any of your rights in
              relation to your Personal Data please send an email to us at{' '}
              <a href="mailto:Hello@HeyTravelista.com">
                Hello@HeyTravelista.com
              </a>{' '}
              marked with the subject "DATA SUBJECT RIGHTS".
            </li>
          </ul>

          <h3 id="privacy-policy-change">8. Changes to Privacy Policy</h3>
          <ul>
            <li>
              <span>8.1</span>Any changes we make to our Privacy Policy and the
              Hey Travelista <Link to="/tnc">Terms and Conditions</Link> in the
              future will be posted on this page and if appropriate will be
              notified to you.
            </li>
            <li>
              <span>8.2</span>Any revised version of this Privacy Policy and the
              Hey Travelista Terms and Conditions shall be effective as at the
              date of publication on the Hey Travelista Website. You have full
              responsibility to keep yourself updated on any changes on this
              Privacy Policy and the Hey Travelista Terms and Conditions.
            </li>
          </ul>

          <h3 id="contact">9. Contact</h3>
          <ul>
            <li>
              <span>9.1</span>Unless otherwise specified, you may visit us on{' '}
              <a href="https://www.heytravelista.com">
                https://www.heytravelista.com
              </a>{' '}
              or contact us in writing attention to: “Personal Data Officer, Hey
              Travelista Limited, Hua Fu Commercial Building, Unit 705, 111
              Queen’s Road West, Sheung Wan, Hong Kong”.
            </li>
            <li>
              <span>9.2</span>If you are located in the EU, and if you have any
              concerns about our use of your information, you also have the
              right to make a complaint to the data protection regulator in your
              country.
            </li>
          </ul>
        </article>
      </div>
    );
  }
}

export default injectFooter(PrivacyPolicy);
