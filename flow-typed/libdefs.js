// @flow

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void,
  },
};

// eslint-disable-next-line flowtype/no-weak-types
declare var FB: any;
