// @flow

export function trackPageView(pathname: string) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('track page view', pathname);
  }
}
