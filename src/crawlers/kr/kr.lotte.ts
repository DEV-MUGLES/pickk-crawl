import axios from 'axios';
import { JSDOM } from 'jsdom';
import qs from 'querystring';

import BaseCrawler from '../base';

const parseStatus = (s: string) => {
  if (s.includes('상품접수')) return { id: 'at_pickup', text: '상품인수' };
  if (s.includes('배송 출발'))
    return { id: 'out_for_delivery', text: '배송출발' };
  if (s.includes('배달 완료')) return { id: 'delivered', text: '배송완료' };
  return { id: 'in_transit', text: '이동중' };
};

const parseLocationName = (locationName: string) =>
  locationName.replace(/\n|\t/gi, '').trim();

export class KRLotteCrawler extends BaseCrawler {
  public static carrierId = 'kr.lotte';
  public static info = {
    name: '롯데택배',
    tel: '+8215882121',
  };

  crawl = () => {
    return new Promise(async (resolve, reject) => {
      const { data } = await axios.post(
        'https://www.lotteglogis.com/home/reservation/tracking/linkView',
        qs.stringify({
          InvNo: this.trackingCode,
        })
      );

      const dom = new JSDOM(data);
      const { document } = dom.window;

      const [informationTable, progressTable] = Array.from(
        document.querySelectorAll('.tblH')
      );

      const information = informationTable.querySelectorAll('tbody > tr > td');
      if (information.length === 1) {
        reject({
          code: 404,
          message: information[0].innerHTML,
        });
        return;
      }

      const shippingInformation = {
        from: { time: null, name: information[1].textContent },
        to: { time: null, name: information[2].textContent },
        state: {},
        progresses: ((table) => {
          const result = [];
          table.querySelectorAll('tbody > tr').forEach((element) => {
            const tds = element.querySelectorAll('td');
            if (tds.length < 4) return;
            if (tds[1].textContent.indexOf('--:--') !== -1) return;

            result.push({
              status: parseStatus(tds[0].textContent),
              time: `${tds[1].textContent.replace(/\s+/g, 'T')}:00+09:00`,
              location: {
                name: parseLocationName(tds[2].textContent),
              },
              description: tds[3].textContent,
            });
          });
          return result;
        })(progressTable),
      };

      if (shippingInformation.progresses.length < 1) {
        const errorTd = progressTable.querySelector('tbody > tr > td');
        reject({
          code: 404,
          message: errorTd ? errorTd.textContent : '화물추적 내역이 없습니다.',
        });
        return;
      } else {
        shippingInformation.state =
          shippingInformation.progresses[
            shippingInformation.progresses.length - 1
          ].status;
        shippingInformation.from.time = shippingInformation.progresses[0].time;

        if (
          shippingInformation.progresses[
            shippingInformation.progresses.length - 1
          ].status.id === 'delivered'
        )
          shippingInformation.to.time =
            shippingInformation.progresses[
              shippingInformation.progresses.length - 1
            ].time;
      }

      resolve(shippingInformation);
    });
  };
}
