import axios from 'axios';

import BaseCrawler from '../base';

const parseStatus = (s: string) => {
  if (!s) {
    return {
      id: 'wating',
      text: '접수대기',
    };
  }
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

        const { data } = await axios.get(
          `http://info.sweettracker.co.kr/api/v1/trackingInfo?t_key=Js4JWlYSWEuTPGYtugXaDw&t_code=05&t_invoice=${this.trackingCode}`
        );

        const kind = data.lastDetail?.kind;

        const shippingInformation = {
          from: {
            name: '',
            time: null,
          },
          to: {
            name: '',
            time: null,
          },
          state: parseStatus(kind),
          progresses: data.trackingDetails?.map((trackingDetail) => ({
            time:
              new Date(trackingDetail.time).toISOString().slice(0, -5) +
              '+09:00',
            location: {
              name: trackingDetail.where,
            },
            status: {
              id: parseStatus(trackingDetail.kind),
              text: trackingDetail.kind,
            },
            description: '',
          })),
        };

        resolve(shippingInformation);
      } catch (err) {
        reject(err);
      }
    });
  };
}
