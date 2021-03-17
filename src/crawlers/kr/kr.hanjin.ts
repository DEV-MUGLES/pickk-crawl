import axios from 'axios';
import { JSDOM } from 'jsdom';
import FormData from 'form-data';

import BaseCrawler from '../base';

const parseStatus = (s: string) => {
  if (s.includes('집하')) return { id: 'at_pickup', text: '상품인수' };
  if (s.includes('배송출발'))
    return { id: 'out_for_delivery', text: '배송출발' };
  if (s.includes('배송완료')) return { id: 'delivered', text: '배송완료' };
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

        const formData = new FormData();
        formData.append('mCode', 'MN038');
        formData.append('schLang', 'KR');
        formData.append('wblnum', this.trackingCode);

        const { data } = await axios.post(
          'https://www.hanjin.co.kr/kor/CMS/DeliveryMgr/WaybillResult.do',
          formData,
          {
            headers: formData.getHeaders(),
          }
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

        progressTable.querySelectorAll('tr').forEach((element) => {
          const [timeEle, nameEle, statusEle] = Array.from(
            element.querySelectorAll('th, td')
          );
          // TODO : time 년도 처리 나중에 수정 해야 함 (현재 시간하고 마지막 시간하고 비교해서 마지막 시간이 미래면 작년으로 처리)
          const curTime = new Date();
          let time = `${curTime.getFullYear()}-${timeEle.innerHTML
            .replace('<br>', 'T')
            .replace(/<[^>]*>/gi, '')
            .replace(/\./gi, '-')}:00+09:00`;

          if (new Date(time) > curTime) {
            time = `${curTime.getFullYear() - 1}${time.substring(4)}`;
          }

          shippingInformation.progresses.unshift({
            time,
            location: {
              name: nameEle.textContent,
            },
            status: parseStatus(statusEle.textContent),
            description: statusEle.textContent,
          });
        });

        if (shippingInformation.progresses.length > 0) {
          shippingInformation.state =
            shippingInformation.progresses[
              shippingInformation.progresses.length - 1
            ].status;
          shippingInformation.from.time =
            shippingInformation.progresses[0].time;
          if (
            shippingInformation.progresses[
              shippingInformation.progresses.length - 1
            ].status.id === 'delivered'
          )
            shippingInformation.to.time =
              shippingInformation.progresses[
                shippingInformation.progresses.length - 1
              ].time;
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
