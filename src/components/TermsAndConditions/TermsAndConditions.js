// @flow

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './TermsAndConditions.scss';
import foundation from '../../styles/foundation.scss';
import Navigation from '../../containers/Navigation';
import HTPageTitle from '../HTPageTitle/HTPageTitle';
import HTText from '../HTText/HTText';
import { injectFooter } from '../../utils/utils';

type Props = {};

class TermsAndConditions extends PureComponent<Props> {
  render() {
    return (
      <div>
        <HTPageTitle translationKey="page.title.terms_and_conditions" />
        <Navigation />

        <section className={styles.termsAndConditionsHeader}>
          <div
            className={classNames(
              foundation['grid-container'],
              styles.termsAndConditionsHeaderWrapper
            )}
          >
            <h2 className={styles.title}>
              <HTText translationKey={'terms_and_conditions.title'} />
            </h2>
          </div>
        </section>

        <article
          className={classNames(
            styles.termsAndConditionsArticle,
            foundation['grid-container']
          )}
        >
          <p>
            The website of www.heytravelista.com and associated apps ("<strong>
              the Site
            </strong>") are owned and operated by Hey Travelista Limited, (Hong
            Kong Business Registration Number 68327335), trading as Hey
            Travelista with Hong Kong Travel Agent License No. 354282. On this
            website and under any booking condition, Hey Travelista and
            affiliated entities in the provision of the services it agrees to
            provide, are included in the expressions the ("<strong>
              Company
            </strong>"), ("<strong>Hey Travelista</strong>") and a person taking
            advantage of the services offered by Hey Travelista, and all other
            persons (if any) included with that person in the booking, are
            included in the expression ("<strong>you</strong>", "<strong>
              your
            </strong>", a "<strong>client</strong>", "<strong>passenger</strong>"
            or "<strong>travelista</strong>").
            <br />
            <br />
            Hey Travelista sells bookings and other ancillary services of and
            for travel, accommodation and other leisure activities (“<strong>
              Arrangements
            </strong>”). Hey Travelista is neither a common carrier nor a
            private carrier and does not provide any of the travel,
            accommodation or any other activities described on this website. Hey
            Travelista acts as your agent in making the Arrangements with third
            party merchants who provide Travel Products as principals (“<strong>
              Merchants
            </strong>”). Hey Travelista is not the agent of any such principal.
            You will also be subject to the terms and conditions of any
            Merchants in addition to these terms and conditions.
          </p>

          <h3>User agreement</h3>

          <p>
            This agreement ("<strong>agreement</strong>") is between you and Hey
            Travelista. By visiting and/or using the Site you agree to be bound
            by the terms of this agreement. The Company may modify its terms and
            conditions without notice at any time where such amendment does not
            substantially affect your rights and obligations. If in the view of
            the Company, such changes to the terms and conditions may
            substantially affect your rights and obligations the Company will
            notify you by email with these changes as they occur.
            <br />
            <br />
            By landing on the Site and using the Site to search for and/or
            booking the products and/or services offered, you are indicating{' '}
            <i>
              that you have read the user agreement posted on the Site and that
              you have accepted the terms and conditions of this agreement
            </i>.
          </p>

          <h3>Registration</h3>

          <p>
            In order to purchase any item and to access certain ‘travelista
            only’ areas of the Site, you need to be a registered travelista of
            the Site. When registering to become a travelista, you must provide
            Personal Information (as this term is defined in the Personal Data
            (Privacy) Ordinance (Chapter 486) Hong Kong) including your first
            and last name, mobile phone number and a valid email address.
          </p>
          <ul>
            <li>
              You agree to provide accurate and complete information and to keep
              this information current. Your information is stored securely, and
              will only be used and disclosed in accordance with the{' '}
              <Link to="/privacy-policy">Privacy Policy</Link>.
            </li>
            <li>
              You are solely responsible for the activity that occurs on your
              account, and you must keep your account password secure. If you
              suspect or become aware of any unauthorised use of your account or
              that your password is no longer secure, you should notify the
              Company immediately (hello@heytravelista.com) and address your
              email to the Customer Service Director. The Company is not liable
              for any unauthorised use of your account.
            </li>
          </ul>

          <h3>Legal Age Requirement</h3>

          <p>
            By making a purchase through the Site you warrant that you are over
            18 and that you have the legal right and ability to enter into a
            legally binding agreement with the Company. No persons under the age
            of 18 are permitted to use the Site or to sign up as a travelista of
            the Site.
          </p>

          <h3>Site Changes</h3>

          <p>
            The Company reserves the right for any reason to change, alter, vary
            or amend the Site at any time. The Company may in its sole
            discretion terminate your account or restrict your access to the
            Site. If it does this, you may be prevented from accessing all or
            parts of the Site, your account details, or other content contained
            in your account.
          </p>

          <h3>Disclaimer</h3>

          <p>
            For purchases on the Site, the price that is listed at the time of
            your order on the final product page applies. Your travelista prices
            are the final prices.
          </p>

          <h3>Use of Site</h3>
          <ul>
            <li>
              You agree not to access (or attempt to access) any part of the
              Site by any means other than through the interface provided by the
              Company.
            </li>
            <li>
              You agree that you will not engage in any activity that interferes
              with or disrupts the Site or the servers and networks that host
              the Site. You may not use data mining, robots, screen scraping or
              similar data gathering and extraction tools on the Site except
              with the Company’s prior written consent.
            </li>
            <li>
              You agree not to, or attempt to, circumvent, disable or otherwise
              interfere with security-related features of the Site or features
              that prevent or restrict use or copying of any content or enforce
              limitations on the use of the Site or the content therein.
            </li>
            <li>
              You agree not to use, copy, distribute or commercialise content
              except as permitted by this agreement, by law or with the
              Company’s prior written consent.
            </li>
            <li>
              You understand and agree that any suspected fraudulent, abusive or
              illegal activity may be referred to appropriate law enforcement
              authorities.
            </li>
            <li>
              The Company reserves the right to cancel your registration at any
              time, subject to its complete discretion.
            </li>
            <li>
              You agree to keep your own login and password information safe and
              to not permit or authorise any third parties to use your login and
              password.
            </li>
          </ul>

          <h3>Information on this Site</h3>
          <p>
            Information about offers on the Site are based on material provided
            by Merchants. The Company does its best to verify the information
            provided to it by Merchants but cannot guarantee its accuracy on all
            occasions.
          </p>
          <ul>
            <li>
              You understand and agree that the Company cannot be held
              responsible and shall have no liability for errors or omissions
              caused by incorrect or inadequate information supplied to it by
              Merchants.
            </li>
            <li>
              You agree to make your own enquiries to verify information
              provided and to assess the suitability of products before you
              purchase.
            </li>
          </ul>

          <h3>Price</h3>
          <p>
            The prices of offers include all taxes and service charges (where
            applicable). Prices of products and services are current at time of
            display, however are subject to change. Some prices can only be
            guaranteed at the time the booking is made and may differ from that
            quoted as it is based on the “best available rate of the day from
            the Merchant”.
            <br />
            <br />
            Final charged/invoiced prices are in Hong Kong dollars (except where
            stated otherwise) however, you may elect to view the price in other
            currencies as a point of reference only
            <br />
            <br />
            Government taxes and charges imposed by Merchants or third parties,
            are subject to change.
          </p>

          <h3>Reservations and Payment</h3>
          <p>If you elect to book, you will be required to:</p>
          <ul>
            <li>
              Log into the Site (using your email address and password or via
              Facebook, Instagram or Google+).
            </li>
            <li>Click on the relevant offer.</li>
            <li>Fill in any required fields.</li>
            <li>
              Ensure names being used to make a booking with the Company are
              exactly as those appearing in the passports which will be
              presented at the time of travel or use of services purchased.
            </li>
            <li>
              Once your booking is complete click on “Continue” to proceed to
              payment and complete the payment process to complete your booking
              online.
            </li>
          </ul>
          <p>
            Once you have completed your booking, the Company will be notified
            of your selected dates and, following confirmation of those dates,
            your credit card will be debited in respect of the payment amount.
            <br />
            <br />
            You are responsible for making all payments due to the Site, even if
            your booking includes other parties. A booking request can only be
            processed where you have provided the Company with payment authority
            (including payment details) and the booking has been accepted as set
            out above. The Company accepts no liability for any errors you make
            in the booking form.
            <br />
            <br />
            All payments must be received in full prior to a confirmation being
            issued. If your payment is not received by us or is declined by your
            bank or credit card issuer, the Company cannot 'hold' offers on your
            behalf.
          </p>

          <h3>Purchase</h3>
          <p>
            Purchases made by you are made under the specific terms and
            conditions in this agreement, together with any Merchant-specific
            terms and conditions listed under the “hotel terms and conditions”
            on the Site.
            <br />
            <br />
            Promotion of an offer on the Site does not constitute a legally
            binding offer, but rather, an invitation to purchase.
            <br />
            <br />
            The Company reserves the right to accept or reject your purchase for
            any reason (or no reason) at any time after that purchase has been
            made, including, but not limited to, the unavailability of any
            product or service, an error in the price or product or service
            description, or an error in your order. If the Company cancels your
            order, it will provide a full refund of any payment received from
            you. Once you place your order, you cannot cancel.
          </p>

          <h3>Accessibility of Booking Confirmation</h3>
          <p>
            Your travel booking confirmation will be sent to you in an email and
            be accessible via your account with the Site. You agree that the
            Company is not liable for any loss suffered as a result of you being
            unable to download, print or access a booking confirmation.
          </p>

          <h3>Travel Booking Confirmation</h3>
          <p>
            The travel booking confirmation purchased is redeemable for the
            specified offer from the relevant Merchant(s). The relevant
            Merchant(s), not the Company, is the seller of the product and is
            solely responsible for honoring your purchase. Whilst the Company
            aims at all times to ensure that it only promotes those Merchants
            who the Company feels will provide good service to you, it gives no
            guarantee, warranty or representation regarding the standard of any
            product to be provided.
          </p>

          <h3>Travel Agreements and Travel Products</h3>
          <p>
            Booking of travel arrangements and payment for travel products
            (which can include both land and passage components) shall be
            considered proof that you have read the terms of this agreement, and
            that you accept them without reservation as constituting the entire
            agreement between you and the Company which can only be varied by an
            officer of the Company in writing.
            <br />
            <br />
            All travel products arranged by the Company are provided by
            Merchants believed by the Company to be reputable and to operate in
            accordance with the standards set down by their own local
            authorities. Those travel products are provided subject to those
            Merchants’ own terms, conditions and limitations (some of which
            terms may exclude or limit liability in respect of death, injury,
            delay, loss or damage to a passenger’s person and/or effects). You
            accept that the Company has no responsibility for the terms,
            conditions and limitations of any Merchant and does not make or give
            any warranty or representation as to their standard. Any legal
            recourse you may have in respect of those travel products is against
            those Merchants and not against the Company.
          </p>

          <h3>What is not included</h3>
          <p>
            Only the items listed in the offers and packages are included in the
            prices. All other items, including (but not limited to) entry and
            exit taxes, baggage expenses, extra expenses due to the acts of
            nature or any political reasons, any medication, evacuation and
            rescue etc. in emergencies, any insurances and any other expenses of
            personal nature are specifically excluded.
          </p>

          <h3>Merchant Terms & Conditions</h3>
          <p>
            Any terms and conditions of the Merchant will always apply in
            addition to any specific terms of the offer stated by the Company.
            For example, if a Merchant is not open on certain days, the room
            availability will not be redeemable on those days.
          </p>

          <h3>Consecutive Days</h3>
          <p>
            Unless the offer specifically provides otherwise, offers must be
            used over one contiguous period. For example, if an offer entitles
            you to four nights at a resort, those four nights must be used
            consecutively - you cannot use two nights over one period, and then
            two nights over another.
          </p>

          <h3>Price and Invoice Errors</h3>
          <p>
            The Company endeavors to ensure that all prices listed on the Site
            are accurate and up-to-date. However, due to exchange rate
            fluctuations or increases in merchant rates, the Company reserves
            the right, up to and including the date of check-in, to adjust any
            fees, charges or prices as necessary, even if the travel products
            acquired have been paid for in full, to reflect such cost increases
            passed onto the Company.
            <br />
            <br />
            The Company reserves the right to correct any errors in fees,
            charges, rates or prices quoted or billed, even if the travel
            products acquired have been paid for in full.
          </p>

          <h3>Cancellations, Alterations and Reissues</h3>
          <p>
            Bookings cannot be cancelled, altered, modified and nor can the name
            of the buyer be changed. For this reason, the Company strongly
            recommends that your travel insurance policy includes coverage for
            cancellation charges in the event of cancellation due to illness or
            other circumstances.
          </p>

          <h3>Refunds</h3>
          <p>
            Any purchase made through the Company's Site is non-refundable.
            Refunds will not be entertained after booking.
          </p>

          <h3>Insurance</h3>
          <p>
            The Company recommends that all passengers take out adequate travel
            insurance cover valid for the entire duration of their travel
            arrangements.
            <br />
            <br />
            The Company recommends travel insurance against loss of deposits
            through cancellation charges, baggage loss, medical expenses and
            theft. The Company gives no warranty or guarantee and makes no
            representation concerning reimbursement of funds paid by you under
            any insurance claims. You agree that the Company cannot be held
            responsible for any decision made by insurers, and/or by any
            Merchants, or requirements of any overseas country or governmental
            authority or overseas laws and policies.
          </p>

          <h3>Passports, Visa, Vaccinations, and Baggage</h3>
          <p>
            A visa does not guarantee you entry to a country or permission to
            remain in it. Some countries may refuse entry because of your
            health, condition, or other circumstances or for other reasons, or
            may detain, expel or repatriate you. It is your responsibility to
            find out about applicable entry and other requirements of overseas
            countries you are intending to visit. These things are not the
            responsibility the Company.
            <br />
            <br />
            You should check with the embassies or consulates or other
            authorities of the countries in which you intend to travel for any
            health, entry or visa requirements that are applicable and you
            should make the appropriate disclosures as required. A failure to
            disclose a health condition may result in the applicable country
            refusing you entry, or in you being detained, expelled or
            repatriated from it.
            <br />
            <br />
            The Company and/or its directors, employees and agents accept no
            responsibility if you are refused entry into the country/countries
            of your destination. The Company and/or its directors, employees and
            agents are not liable for any expenses, costs liabilities or loss
            incurred in relation to such matters. You agree not to hold the
            Company, including its directors, employees and agents, responsible
            for any such thing. The Company/and or its directors, employees and
            agents are not responsible for any disclosures of a health condition
            made by third parties who provide services on the holiday or for the
            acts of any governmental entities of the countries connected to your
            holiday.
            <br />
            <br />
            You are responsible for all visas, entry, health and other
            requirements and any documents required by any laws, regulations,
            orders and/or requirements of countries visited. The Company and/or
            its directors, employees and agents are not responsible for passport
            and visa requirements or for any loss you sustain for failing to
            comply with laws, regulations, orders and/or requirements of
            countries visited. To ensure your safety, it may be necessary for
            the Company and/or its directors, employees and agents to disclose
            your condition of health to Merchants of other services connected
            with your holiday. You hereby authorise the Company and/or its
            directors, employees and agents to make such disclosure on your
            behalf and agree that a disclosure by the Company and/or its
            directors, employees and agents shall not amount to a breach of
            confidence or duty and you will not hold the Company and/or its
            directors, employees and agents liable in tort or in contract or
            under any anti-discrimination laws.
          </p>

          <h3>Room Bedding Guide</h3>
          <p>
            All prices on this Site are based on existing bedding in the room.
            Requests for particular arrangements must be made at the time of
            booking (for example, twin share, separate beds, additional rollaway
            beds may be arranged at time of check-in and additional charges may
            be payable direct to the hotel). Some hotels may also have maximum
            capacity for particular rooms.
          </p>

          <h3>Frequent Flyer / Frequent Hotel Loyalty Points</h3>
          <p>
            The Company offer may not attract Frequent Flyer or hotel frequent
            loyalty points. This decision rests with the relevant airlines,
            hotels and resorts and is not the responsibility of the Company. For
            further information please contact the Merchant directly.
          </p>

          <h3>Limitations of Liability</h3>
          <p>
            The Company arranges your holiday, which will be provided by other
            Merchants. The Company is registered and sells holidays from Hong
            Kong that are arranged by the Company or by entities related to or
            affiliated with it. The Company provides you and other passengers
            with booking arrangements and other ancillary and related services.
            <br />
            <br />
            The Company does not itself provide the transport, accommodation,
            meals or other facilities described on this Site that you may
            receive on your holiday, all of which are provided cruise operators,
            hoteliers or merchants of other services as principals.
            <br />
            <br />
            The Company agrees to make the reservations with the Merchants
            offering the services described on this Site on these terms and
            conditions.
          </p>

          <h3>Site content</h3>
          <p>
            All information, such as comments, messages, text, files, images,
            photos, video, sounds and other materials ("content") posted on,
            transmitted through or linked from the Site are the sole
            responsibility of the person from whom such content originated.
            <br />
            <br />
            You understand that the Company does not control and is not
            responsible for content made available through the Site unless it
            originates from the Company. Consequently, by using the Site you
            may, contrary to the Company’s intentions, be exposed to content
            that you find offensive, indecent, inaccurate, misleading or
            otherwise objectionable. You use the Site at your own risk.
          </p>

          <h3>Responsibilities</h3>
          <p>
            The Company shall be responsible for arranging supply of the
            services described on this Site, except where such services cannot
            be supplied or the itinerary used is changed in circumstances which
            are beyond the control of the Company.
            <br />
            <br />
            In such circumstances, the Company will do its best to arrange
            supply of comparable services and itineraries and there shall be no
            refund in this connection. In the absence of its own negligence,
            neither the Company nor any agent or affiliate has any liability for
            any cancellations, diversions, substitution of equipment,
            variations, postponements or any other act, omission or default of
            air or land carriers, cruise operators, hoteliers or hotels,
            transport companies or any other Merchants nor for any consequences
            thereof such as changes in services, accommodation or facilities.
            <br />
            <br />
            In the absence of its own negligence neither the Company nor any
            agent or affiliate shall be liable for any loss or damage to baggage
            or property, or for injury, illness or death, or for any damages or
            claims whatsoever arising from loss, negligence, delay or from the
            act, error, omission, default or negligence of any person not its
            direct employee or under its exclusive control, including any act,
            error, omission, default, or negligence of any country, government
            or governmental authority, officer or employee. Neither the Company
            nor any of its directors, employees, agents or affiliates is
            responsible for any criminal conduct by any third parties.
            <br />
            <br />
            All bookings agreed to be made by the Company with the provider of
            any transport or other services are subject to the terms and
            conditions imposed by such Merchants in relation to matters that may
            not be expressly the subject of the Company’s agreement with them
            and, in particular, to the applicable laws, requirements and
            policies of any government, governmental authority or employee
            including, visa, entry, exit or transit.
            <br />
            <br />
            The Company does not accept responsibility or liability for any
            acts, omissions or defaults whether negligent or otherwise, of
            Merchants. Neither the Company, nor any agent or affiliate accepts
            any responsibility or liability of any nature whatsoever for the
            acts, omissions or defaults (whether negligent or otherwise) of any
            governmental authorities, their officers, or employees or of any
            employees, or agents of airlines, air carriers, coach operators,
            other land carriers, shipping companies or operators, cruise or
            ferry operators, any other transport providers, hoteliers or other
            accommodation providers, any other facilities providers, tour
            directors, tour guides, travel agents, or the providers to you of
            meals, other goods or other services on your holiday or in relation
            to it and over whom the Company, its agents or affiliates have no
            direct control.
            <br />
            <br />
            Neither the Company nor any agent or affiliate accepts any
            responsibility or liability of any nature whatsoever including but
            not limited to contract, in tort or under any other law for any
            injury, damage, loss, delay, additional expenses or inconvenience
            caused by your own acts and/or omissions, or other events which are
            beyond their control including force majeure or other events
            including but not limited to war, civil disturbance, fire, floods,
            severe weather, acts of God, acts of government or any other
            authorities, failure of equipment or machinery.
            <br />
            <br />
            Neither the Company nor any agent or affiliate accepts any liability
            or responsibility for any terms, conditions or requirements of any
            third party who provides some service in the course of your holiday.
            If you decide that you do not want to visit a country or part of a
            country you intended to visit because of any law, condition or
            requirements of any government or governmental authority, official,
            servant or agent, you are responsible for any costs, expenses,
            charges, fees, losses or damage incurred as a consequence and any
            cancellation or amendment fees.
            <br />
            <br />
            Whilst every effort is made to ensure Site accuracy at all times,
            the Company cannot be held responsible for the consequences of any
            printing or typographical errors or errors that may occur.
          </p>

          <h3>Links to third party sites</h3>
          <p>
            The Site may include links to other websites, content or resources.
            Where linked websites, content or resources are operated by third
            parties, the Company has no responsibility or control over them.
            <br />
            <br />
            The existence of these links does not imply that the Company
            endorses the linked website, content or resource. You acknowledge
            that the Company may have not reviewed any of these third-party
            websites, content or resources and it is not responsible for the
            material contained therein.
          </p>

          <h3>Other Conditions</h3>
          <p>
            It is your responsibility to comply with the terms and conditions of
            this agreement and the requirements of any merchant and/or service
            provider, or any country or governmental authorities, and to bear
            any costs or losses incurred as a consequence of you not complying
            with them.
          </p>

          <h3>Standard of Service</h3>
          <p>
            The standard of service in your holiday is based on various factors
            and neither the Company nor its directors, employees or agents
            warrant, represent or guarantee the standard or fitness for purpose
            of the accommodation or services provided.
          </p>

          <h3>Complaints</h3>
          <p>
            The Company endeavors to ensure that the arrangements made for you
            are implemented as arranged. If a problem occurs, the most practical
            way to deal with it is to attempt resolution locally with the
            Merchant (such as the hotel, or cruise operator) at the time of the
            incident or immediately following the incident.
            <br />
            <br />
            If you fail to follow this course, any claim for compensation may be
            reduced or denied.
            <br />
            <br />
            If you have any unresolved complaint, details should be lodged in
            writing (with supporting documentation, including efforts made with
            the service provider to resolve it) directly to the Company within
            10 days of return to your residence country.
            <br />
            <br />
            The Company has no liability (including for loss or damage) for any
            act, omission or default, whether negligent or otherwise of any
            Merchant. If you wish to make a complaint in respect of a Merchant,
            you must email that complaint to hello@heytravelista.com.
            <br />
            <br />
            Notwithstanding the nature of the complaint, refunds will only be
            provided in accordance with the Company’s Refund Policy.
          </p>

          <h3>Intellectual Property</h3>
          <p>
            All intellectual property rights in the Site, the contents thereof,
            the materials published on it, the name and mark “Hey Travelista”
            are the exclusive property of the Company.
            <br />
            <br />
            The Company is the owner or the licensee or authorised user of all
            intellectual property rights on the Site, including, but not limited
            to, the contents thereof, the materials published on it, the name
            and mark “Hey Travelista”. Those works are protected by, among other
            laws, copyright laws and treaties around the world. All such rights
            are reserved. You must not use any part of the materials on the Site
            and/or the name and mark “Hey Travelista” for commercial purposes
            without obtaining a licence to do so (including your payment for any
            relevant licence fee) from the Company or licensor of the Company.
            Unless otherwise specified, the Company’s status (and any identified
            contributors) as the authors of the material on the Site must be
            acknowledged.
            <br />
            <br />
            If you correspond or otherwise communicate with the Company, you
            automatically grant to it an irrevocable, perpetual, non-exclusive,
            royalty-free, world-wide license to use, copy, display and
            distribute the content of your correspondence or communication and
            to prepare derivative works of the content or incorporate the
            content into other works in order to publish and promote such
            content. This may include, but is not limited to, publishing
            testimonials on the Site and developing your ideas and suggestions
            for improved products or services the Company provide. You agree
            that you will not make any claim, monetary or otherwise, against the
            Company for use of such content. You hereby hold harmless and
            release the Company from all claims, demands and causes of action
            which you, your representatives, executors, administrators or any
            other persons acting on your behalf or on behalf of your estate have
            or may have by reason of this authorisation.
          </p>

          <h3>Change of Control</h3>
          <p>
            Subject to relevant laws, if the Company merges, sells or is
            otherwise subject to any change of control of the business or Site,
            it reserves the right, without giving notice or seeking consent, to
            transfer or assign your Personal Information, content and rights
            that it has collected from you and any agreements it has made with
            you.
          </p>

          <h3>Indemnity</h3>
          <p>
            You will at all times indemnify, and keep indemnified, the Company’s
            directors, officers, employees and agents from and against any loss
            (including reasonable legal costs and expenses on a full indemnity
            basis) for liability incurred or suffered by the Company arising
            from any claim, demand, suit, action or proceeding by any person
            against the Company where such loss or liability arose out of, in
            connection with or in respect of your conduct or breach of this
            agreement.
          </p>

          <h3>Communication by the Company</h3>
          <p>
            As a condition of registering with the Company you consent to
            receiving Administrative Emails and Promotional Emails as follows:
          </p>
          <ul>
            <li>
              'Administrative Emails' involve details of account activity and
              purchases you have made
            </li>
            <li>
              'Promotional Emails' consist of product information and new
              offers. You may choose to opt-out of receiving promotional emails
              at any time by simply clicking the unsubscribe button at the
              bottom of the Company emails. More details about these emails can
              be found in the <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
          </ul>

          <h3>Governing Law</h3>
          <p>
            This agreement is governed by and shall be interpreted in accordance
            with Hong Kong law. Any dispute, controversy, difference or claim
            arising out of or relating to this agreement, including the
            existence, validity, interpretation, performance, breach or
            termination thereof or any dispute regarding non-contractual
            obligations arising out of or relating to it shall be referred to
            and finally resolved by arbitration administered by the Hong Kong
            International Arbitration Centre (HKIAC) under the HKIAC
            Administered Arbitration Rules in force when the Notice of
            Arbitration is submitted. The seat of arbitration shall be in Hong
            Kong and there shall be a single arbitrator. The arbitration
            proceedings shall be conducted in English.
          </p>
        </article>
      </div>
    );
  }
}

export default injectFooter(TermsAndConditions);
