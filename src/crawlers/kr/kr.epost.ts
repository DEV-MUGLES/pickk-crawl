import axios from 'axios';
import cheerio from 'cheerio';
import qs from 'querystring';

import BaseCrawler from '../base';
import { DELIVERED_STATUS_TEXT } from '../constants';
import { ShippingInformation } from '../types';

const parseStatus = (s: string) => {
  if (s.includes('집하완료')) return { id: 'at_pickup', text: '상품인수' };
  if (s.includes('배달준비'))
    return { id: 'out_for_delivery', text: '배송출발' };
  if (s.includes('배달완료'))
    return { id: 'delivered', text: DELIVERED_STATUS_TEXT };
  return { id: 'in_transit', text: '이동중' };
};

const parseTime = (s: string) =>
  parseDescription(s.replace(/([\n\t]{1,}|\s{2,})/g, ' ').replace(/\t/gi, ''));

const parseDescription = (s: string) => s.replace(/  /, ' ').trim();

export class KREpostCrawler extends BaseCrawler {
  public static carrierId = 'kr.epost';
  public static info = {
    name: '우체국택배',
    tel: '+8215881300',
  };

  crawl = () =>
    new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(
          'https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm',
          qs.stringify({
            sid1: this.trackingCode,
          })
        );
        const $ = cheerio.load(data.toString('utf-8'));
        const [informationTable, progressTable] = Array.from($('tbody'));

        if (!progressTable) {
          return reject({
            code: 404,
            message: '운송장 정보를 찾을 수 없습니다.',
          });
        }

        const informationTable$ = $(informationTable);
        const informationTableRowData$ = informationTable$
          .children('tr')
          .eq(0)
          .children('td');
        const shippingInformation: ShippingInformation = {
          from: {
            name: informationTableRowData$
              .eq(0)
              .text()
              .trim()
              .replace(/[0-9]|\./g, ''),
            time: null,
          },
          to: {
            name: informationTableRowData$
              .eq(2)
              .text()
              .trim()
              .replace(/[0-9]|\./g, ''),
            time: null,
          },
          state: null,
          progresses: [],
        };

        const progressTable$ = $(progressTable);
        progressTable$.children('tr').each((_, element) => {
          const td = $(element).children('td');
          if (td.length === 0) {
            return;
          }
          shippingInformation.progresses.push({
            time: new Date(
              `${td.eq(0).text().replace(/\./g, '-')}T${td
                .eq(1)
                .text()}:00+09:00`
            ),
            location: {
              name: td.eq(2).children('a').eq(0).text(),
            },
            status: parseStatus(td.eq(3).text()),
            description: parseTime(td.eq(3).text()),
          });
        });

        const { progresses } = shippingInformation;
        if (progresses.length > 0) {
          shippingInformation.state = progresses[progresses.length - 1].status;
          shippingInformation.from.time = progresses[0].time;

          if (this.isDelivered(shippingInformation))
            shippingInformation.to.time =
              progresses[progresses.length - 1].time;
        } else
          shippingInformation.state = {
            id: 'information_received',
            text: '방문예정',
          };

        resolve(shippingInformation);
      } catch (err) {
        reject(err);
      }
    });

  isDelivered(shippingInformation: ShippingInformation) {
    const { progresses } = shippingInformation;
    return (
      progresses[progresses.length - 1].status.text === DELIVERED_STATUS_TEXT
    );
  }
}
