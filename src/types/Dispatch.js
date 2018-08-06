// @flow

import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';

import type { Action } from '../actions';

import type { RootState } from '../states';

export type Store = ReduxStore<RootState, Action>;

export type GetState = () => RootState;

// NOTE(limouren): Dispatch & ThunkAction circular reference each other
// thru ThunkAction, disable no-use-before-define
// eslint-disable-next-line no-use-before-define
export type Dispatch = ReduxDispatch<Action> & ThunkDispatch;

// eslint-disable-next-line flowtype/no-weak-types
export type ThunkAction = (Dispatch, GetState) => any;
// eslint-disable-next-line flowtype/no-weak-types
export type ThunkDispatch = ThunkAction => any;
