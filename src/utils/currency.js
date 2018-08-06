// @flow

export function setCurrency(newCurrency: string, refresh: boolean = true) {
  if (!newCurrency) {
    return;
  }
  const oldCurrency = localStorage.getItem('ht_currency') || 'HKD';
  if (oldCurrency !== newCurrency) {
    localStorage.setItem('ht_currency', newCurrency);
    if (refresh) {
      window.location.reload();
    }
  }
}
