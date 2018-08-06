// @flow

import type { Request } from '../types/index';
import type { User } from '../models/User';

export type AuthState = {
  accessToken: ?string,
  isLoggedIn: boolean,
  whoamiRequest: Request,
  signinRequest: Request,
  signupRequest: Request,
  completeSignupRequest: Request,
  forgotPasswordRequest: Request,
  resetPasswordRequest: Request,
  signupInfo: {
    email: string,
    partnerCode: ?string,
  },
  user: ?User,
};
