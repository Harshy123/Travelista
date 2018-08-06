// @flow
import yup from 'yup';
import type { ServerState } from '../models/ServerState';

const serverStateSchema = yup.object().shape({
  hero_video_url: yup.string().nullable(),
  hero_text: yup.string(),
  partners_image: yup.string().required(),
});

// eslint-disable-next-line flowtype/no-weak-types
export function deserializeServerState(response: any): Promise<ServerState> {
  // eslint-disable-next-line flowtype/no-weak-types
  return serverStateSchema.validate(response).then((val: any) => {
    return {
      heroVideoUrl: val.hero_video_url,
      heroText: val.hero_text,
      partnersImage: val.partners_image,
    };
  });
}
