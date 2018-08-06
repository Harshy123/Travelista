// @flow
import { applyMiddleware, createStore } from 'redux';
import 'intl';
import 'intl/locale-data/jsonp/en.js';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import App from './containers/App';
import EventTrackerHead from './containers/EventTrackerHead';
import objectFitImages from 'object-fit-images';
import registerServiceWorker from './registerServiceWorker';
import translationMap from './utils/translationMap';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import reducer from './reducers';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware,
} from 'connected-react-router';
import skygear from 'skygear';

// Polyfills
import 'objectFitPolyfill';

// Styles
import './styles/index.scss';
import './styles/third-party.css';
import 'react-dd-menu/dist/react-dd-menu.min.css';
import 'slick-carousel/slick/slick.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'react-tabs/style/react-tabs.css';
import 'react-day-picker/lib/style.css';

objectFitImages();
const app = document.getElementById('root');
const locale = 'en';

const history = createHistory();

export const store = createStore(
  connectRouter(history)(reducer),
  applyMiddleware(thunk, routerMiddleware(history))
);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextReducer = require('./reducers').default;
    store.replaceReducer(nextReducer);
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId: process.env.HT_FACEBOOK_APP_ID,
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v3.0',
  });
};

(function(d: Document, s: string, id: string) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  // $FlowFixMe
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  // $FlowFixMe
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

function renderApp() {
  if (app == null) {
    return;
  }
  ReactDOM.render(
    <Provider store={store}>
      <IntlProvider locale={locale} messages={translationMap[locale]}>
        <ConnectedRouter history={history}>
          <Fragment>
            <EventTrackerHead />
            <App />
          </Fragment>
        </ConnectedRouter>
      </IntlProvider>
    </Provider>,
    app
  );
  registerServiceWorker();
}

// NOTE(Anson): we are not using skygear.config directly because
// the promise is being rejected when it is run under the "Fetch as Google" UA
// This is probably because localStorage is not implemented in google crawler
// where access token is stored
function configSkygear(endPoint: string, apiKey: string): Promise<void> {
  // eslint-disable-next-line flowtype/no-weak-types
  return skygear.config({ endPoint, apiKey }).catch((error: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed to configure skygear:', error);

    skygear.endPoint = endPoint;
    skygear.apiKey = apiKey;

    return;
  });
}

configSkygear(
  process.env.HT_SKYGEAR_ENDPOINT || '',
  process.env.HT_SKYGEAR_API_KEY || ''
).then(() => renderApp());
