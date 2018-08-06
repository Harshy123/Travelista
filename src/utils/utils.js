// @flow

import React, { Fragment, PureComponent } from 'react';
import HTFooter from '../components/HTFooter/HTFooter';

import type { ComponentType } from 'react';

export function mustBe<T>(param: ?T): T {
  if (param != null) {
    return param;
  } else {
    throw Error(`Failed at unwrapper optional type`);
  }
}

export function getViewPointHeight(): number {
  return (
    window.innerHeight ||
    mustBe(document.documentElement).clientHeight ||
    mustBe(document.body).clientHeight
  );
}

export function flatten<T>(arr: Array<?(T | Array<T>)>): Array<T> {
  return arr.reduce((acc: T[], obj: ?T | ?(T[])) => {
    if (obj == null || obj.length === 0) {
      return acc;
    }
    if (Array.isArray(obj)) {
      return [...acc, ...obj];
    } else {
      return [...acc, obj];
    }
  }, []);
}

export function toHotelDateMapKey(offerId: string, roomTypeId: string): string {
  return offerId + ',' + roomTypeId;
}

export function injectFooter<P: {}>(
  component: ComponentType<P>
): ComponentType<P> {
  return class ComponentWithFooter extends PureComponent<P> {
    render() {
      return (
        <Fragment>
          {React.createElement(component, this.props)}
          <HTFooter />
        </Fragment>
      );
    }
  };
}

export function checkFileType(file: File): Promise<string> {
  const promise = new Promise((resolve: string => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result;
      // Flow insists that buffer is string but it is actually an ArrayBuffer.
      // Suppress the error here.
      // $FlowFixMe
      const uint = new Uint8Array(buffer);
      let bytes: string[] = [];
      for (let i = 0; i < 4; i++) {
        bytes.push(uint[i].toString(16));
      }
      const hex = bytes.join('').toUpperCase();
      const fileType = getMimetype(hex);
      resolve(fileType);
    };
    reader.readAsArrayBuffer(file);
  });
  return promise;
}

const getMimetype = (signature: string) => {
  switch (signature) {
    case '89504E47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case '25504446':
      return 'application/pdf';
    case 'FFD8FFDB':
    case 'FFD8FFE0':
    case 'FFD8FFE1':
      return 'image/jpeg';
    case '504B0304':
      return 'application/zip';
    default:
      return 'Unknown filetype';
  }
};
