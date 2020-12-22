import axios from 'axios';
import { JSDOM } from 'jsdom';

import BaseCrawler from '../base';

const STATUS_MAP = {
  0: { id: 'information_received', text: '방문예정' },
  1: { id: 'at_pickup', text: '상품인수' },
  2: { id: 'in_transit', text: '이동중' },
  3: { id: 'out_for_delivery', text: '배송출발' },
  4: { id: 'delivered', text: '배송완료' },
};

const STR_TO_STATUS = {
  집화처리: 1,
  배달출발: 3,
  배달완료: 4,
};

const cleanString = (s: string) => s.replace(/\n|\t/gi, '').trim();

export class KRCvsnetCrawler extends BaseCrawler {
  public static carrierId = 'kr.cvsnet';
  public static info = {
    name: 'GS Postbox 택배',
    tel: '+8215771287',
  };

  crawl = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(
          'https://www.cvsnet.co.kr/reservation-inquiry/delivery/index.do',
          {
            params: {
              dlvry_type: 'domestic',
              invoice_no: this.trackingCode,
              srch_type: '01',
            },
          }
        );
        const dom = new JSDOM(data);
        const { document } = dom.window;

        const information = Array.from(
          document.querySelectorAll('.deliveryInfo3 table td')
        );
        const progresses = document.querySelectorAll('.deliveryInfo2 ul li');
        const state = Array.from(document.querySelectorAll('.deliveryInfo li'));
        const currentState = document.querySelector('.deliveryInfo li.on');

        if (information.length === 0) {
          return reject({
            code: 404,
            message: document.querySelector('.noData p').textContent,
          });
        }

        const [, , fromDate, fromTime, fromName, toName] = information;

        const shippingInformation = {
          from: {
            name: cleanString(fromName.innerHTML),
            time: `${fromDate.innerHTML}T${fromTime.innerHTML.trim()}:00+09:00`,
          },
          to: {
            name: cleanString(toName.innerHTML),
            time: null,
          },
          state: STATUS_MAP[state.lastIndexOf(currentState)],
          progresses: [],
        };

        progresses.forEach((element) => {
          const time = (function convertTime(t) {
            return `${t.replace('&nbsp;', 'T')}+09:00`;
          })(element.querySelector('p.date').innerHTML);

          let status = STATUS_MAP[2];
          const description = element.querySelector('p.txt').innerHTML;
          // eslint-disable-next-line no-restricted-syntax
          for (const key in STR_TO_STATUS) {
            if (description.includes(key)) {
              status = STATUS_MAP[STR_TO_STATUS[key]];
              break;
            }
          }

          if (status.id === 'delivered') {
            shippingInformation.to = {
              ...shippingInformation.to,
              time,
            };
          }

          shippingInformation.progresses.unshift({
            time,
            location: { name: element.querySelector('p.location').innerHTML },
            status,
            description: element.querySelector('p.txt').innerHTML,
          });
        });

        resolve(shippingInformation);
      } catch (err) {
        reject(err);
      }
    });
  };
}
