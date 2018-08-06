// @flow

export type ServerState = {
  heroVideoUrl: ?string,
  heroText: string,
  partnersImage: string,
};

export function emptySeverState(): ServerState {
  return {
    heroVideoUrl: null,
    heroText: '',
    partnersImage: '',
  };
}
