// @flow
import React from 'react';
import type { Node } from 'react';
// https://stackoverflow.com/questions/46155/how-can-you-validate-an-email-address-in-javascript
export function validateEmailFormat(email: string): boolean {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
}

export function htmlLineBreak(str: string, className: ?string): Node[] {
  return str.split('\n').map((item: string, key: number) => {
    return (
      <span key={key} className={className}>
        {item}
        <br />
      </span>
    );
  });
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function commaSeparate(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
