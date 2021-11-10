import {
  VIDEO_DATA_REGEX,
  VIEW_COUNT_REGEX,
  DURATION_REGEX,
} from '../constants';

export const hasVideoData = ({ data }: cheerio.Element) => {
  if (!data) {
    return false;
  }
  return VIDEO_DATA_REGEX.test(data);
};

export const getViewCountFrom = (data: string) => {
  if (!data) {
    return 0;
  }
  return Number(VIEW_COUNT_REGEX.exec(data)[1]);
};

export const getDurationFrom = (data: string) => {
  if (!data) {
    return 0;
  }
  return Number(DURATION_REGEX.exec(data)[1]);
};
