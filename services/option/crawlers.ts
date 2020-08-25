import OptionCralwer from './Crawler';
import { OptionResult } from 'types/option';

export const cafe24 = (url: string, html: string): OptionResult => {
  return new OptionCralwer(url, html).cafe24().result;
};
