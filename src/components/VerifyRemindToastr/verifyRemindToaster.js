// @flow

import React from 'react';
import { toastrError } from '../../utils/toastr';
import VerifyRemindToastrMessage from './VerifyRemindToastrMessage';

import type { User } from '../../models/User';

export const verifyRemindToastr = (user: User) => {
  return toastrError(null, {
    component: () => <VerifyRemindToastrMessage user={user} />,
  });
};
