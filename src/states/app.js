// @flow

import type { Experience, ServerState } from '../models';
import type { Request } from '../types';

export type SideMenu = {
  isOpen: boolean,
};

export type AuthModalConfig = {
  isOpen: boolean,
  mode: 'signin' | 'signup',
};

export type UpdateCardModalConfig = {
  isOpen: boolean,
};

export type Context = {
  path: ?string,
};

export type Config = {
  currency: string,
};

export type AppState = {
  sideMenu: SideMenu,
  authModalConfig: AuthModalConfig,
  updateCardModalConfig: UpdateCardModalConfig,
  serverState: ServerState,
  serverStateRequest: Request,
  experiences: Experience[],
  experienceRequest: Request,
  context: Context,
  config: Config,
};
