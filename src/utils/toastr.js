// @flow
import { toastr } from 'react-redux-toastr';

const toastrOptions = {
  timeOut: 5000,
  icon: null,
  showCloseButton: false,
};
// eslint-disable-next-line flowtype/no-weak-types
export function toastrError(message: ?string, options: ?any) {
  toastr.clean();
  const customOptions = options
    ? { ...toastrOptions, ...options }
    : toastrOptions;
  toastr.error(message || '', customOptions);
}
// eslint-disable-next-line flowtype/no-weak-types
export function toastrSuccess(message: ?string, options: ?any) {
  toastr.clean();
  const customOptions = options
    ? { ...toastrOptions, ...options }
    : toastrOptions;
  toastr.success(message || '', customOptions);
}

// eslint-disable-next-line flowtype/no-weak-types
export function toastrInfo(message: ?string, options: ?any) {
  const customOptions = options
    ? { ...toastrOptions, ...options }
    : toastrOptions;
  toastr.light(message || '', customOptions);
}

export function clearToastr() {
  toastr.clean();
}
