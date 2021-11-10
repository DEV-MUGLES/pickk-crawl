import axios from 'axios';
import { JSDOM } from 'jsdom';
import qs from 'querystring';

import BaseCrawler from '../base';
import { DELIVERED_STATUS_TEXT } from '../constants';

const parseStatus = (s: string) => {
  if (s.includes('집하')) return { id: 'at_pickup', text: '상품인수' };
  if (s.includes('배송출발'))
    return { id: 'out_for_delivery', text: '배송출발' };
  if (s.includes('배송완료'))
    return { id: 'delivered', text: DELIVERED_STATUS_TEXT };
  return { id: 'in_transit', text: '이동중' };
};

export class KRHanjinCrawler extends BaseCrawler {
  public static carrierId = 'kr.hanjin';
  public static info = {
    name: '한진택배',
    tel: '+8215880011',
  };

  crawl = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          this.trackingCode.length !== 10 &&
          this.trackingCode.length !== 12
        ) {
          return reject({
            code: 404,
            message: '잘못된 운송장 번호입니다.',
          });
        }
        if (
          parseInt(
            this.trackingCode.substring(0, this.trackingCode.length - 1),
            10
          ) %
            7 !==
          parseInt(
            this.trackingCode.substring(this.trackingCode.length - 1),
            10
          )
        ) {
          return reject({
            code: 404,
            message: '잘못된 운송장 번호입니다.',
          });
        }

        const { data } = await axios.post(
          'https://www.hanjin.co.kr/kor/CMS/DeliveryMgr/WaybillResult.do',
          qs.stringify({
            mCode: 'MN038',
            schLang: 'KR',
            wblnum: this.trackingCode,
            wblnumText: '',
          })
        );

        const dom = new JSDOM(data);
        const { document } = dom.window;

        const tables = Array.from(document.querySelectorAll('table'));
        if (tables.length === 0) {
          return reject({
            code: 404,
            message: document.querySelector('.noData').textContent,
          });
        }
        const [informationTable, progressTable] = tables;

        const [, fromTd, toTd] = Array.from(
          informationTable.querySelectorAll('td')
        );

        const shippingInformation = {
          from: {
            name: fromTd.textContent,
            time: null,
          },
          to: {
            name: toTd.textContent,
            time: null,
          },
          state: {
            id: 'delivered',
            text: null,
          },
          progresses: [],
        };

        progressTable.querySelectorAll('tbody > tr').forEach((element) => {
          const { progresses } = shippingInformation;
          const [dateEle, timeEle, nameEle, statusEle] = Array.from(
            element.querySelectorAll('td')
          );

          const time = new Date(
            `${dateEle.textContent}T${timeEle.textContent}:00+09:00`
          );

          progresses.unshift({
            time,
            location: {
              name: nameEle.textContent,
            },
            status: parseStatus(statusEle.textContent),
            description: statusEle.textContent.trim(),
          });
        });

        const { progresses } = shippingInformation;
        const lastProgress = progresses[progresses.length - 1];
        const firstProgress = progresses[0];
        if (progresses.length > 0) {
          shippingInformation.state = lastProgress.status;
          shippingInformation.from.time = firstProgress.time;
          if (lastProgress.status.id === 'delivered')
            shippingInformation.to.time = lastProgress.time;
        } else {
          shippingInformation.state = {
            id: 'information_received',
            text: '방문예정',
          };
        }

        resolve(shippingInformation);
      } catch (err) {
        reject(err);
      }
    });
  };
}
