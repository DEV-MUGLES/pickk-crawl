import axios from 'axios';
import cheerio from 'cheerio';
import { Cookie } from 'tough-cookie';
import qs from 'querystring';

import BaseCrawler from '../base';
import { DELIVERED_STATUS_TEXT } from '../constants';

const STATUS_MAP = {
  null: { id: 'information_received', text: '상품준비중' },
  11: { id: 'at_pickup', text: '상품인수' },
  41: { id: 'in_transit', text: '상품이동중' },
  42: { id: 'in_transit', text: '상품이동중' }, // 원래는 배송지 도착이지만 제공하지 않음 (표준화)
  44: { id: 'in_transit', text: '상품이동중' },
  82: { id: 'out_for_delivery', text: '배송출발' },
  91: { id: 'delivered', text: DELIVERED_STATUS_TEXT },
  RMN: { id: 'in_transit', text: '상품이동중' },
};

const parseTime = (s: string) => {
  return `${s.replace(' ', 'T').substring(0, s.lastIndexOf('.'))}+09:00`;
};

export class KRCjlogicsticsCrawler extends BaseCrawler {
  public static carrierId = 'kr.cjlogistics';
  public static info = {
    name: 'CJ대한통운',
    tel: '+8215881255',
  };

  crawl = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!/^(\d{10}(\d{2})?)?$/.test(this.trackingCode)) {
          return reject({
            code: 400,
            message: '운송장 번호는 10자리 혹은 12자리입니다.',
          });
        }

        const { cookie, _csrf } = await this.getCsrf();

        const { data: parcelData } = await axios.post(
          'https://www.cjlogistics.com/ko/tool/parcel/tracking-detail',
          qs.stringify({
            paramInvcNo: this.trackingCode,
            _csrf,
          }),
          {
            headers: {
              Cookie: cookie,
            },
          }
        );

        const { parcelResultMap, parcelDetailResultMap } = parcelData;
        if (!parcelResultMap || !parcelDetailResultMap) {
          return reject({
            code: 404,
            message: '해당 운송장이 존재하지 않습니다.',
          });
        }

        const informationTable = parcelResultMap.resultList;
        const progressTable = parcelDetailResultMap.resultList;

        if (informationTable.length === 0 && progressTable.length === 0) {
          return reject({
            code: 404,
            message: '해당 운송장이 존재하지 않습니다.',
          });
        }

        const shippingInformation = {
          from: { name: null, time: null },
          to: { name: null, time: null },
          state: { id: 'information_received', text: '상품준비중' },
          progresses: ((rows) =>
            rows.map((row) => ({
              time: parseTime(row.dTime),
              status: STATUS_MAP[row.crgSt],
              location: {
                name: row.regBranNm,
              },
              description: row.crgNm,
            })))(progressTable),
        };

        if (shippingInformation.progresses.length > 0) {
          shippingInformation.state =
            shippingInformation.progresses[
              shippingInformation.progresses.length - 1
            ].status;
        }

        if (informationTable.length !== 0) {
          const { sendrNm, rcvrNm } = informationTable[0];

          shippingInformation.from = {
            name: sendrNm,
            time:
              progressTable.length !== 0
                ? parseTime(progressTable[0].dTime)
                : null,
          };

          shippingInformation.to = {
            name: rcvrNm,
            time:
              shippingInformation.state?.id === 'delivered'
                ? shippingInformation.progresses[
                    shippingInformation.progresses.length - 1
                  ].time
                : null,
          };
        }

        resolve(shippingInformation);
      } catch (err) {
        reject(err);
      }
    });
  };

  getCsrf = async () => {
    return axios
      .get('https://www.cjlogistics.com/ko/tool/parcel/tracking')
      .then((res) => {
        const cookie = res.headers['set-cookie']
          .map((v) => Cookie.parse(v))
          .map((c) => c.cookieString())
          .join('; ');
        const $ = cheerio.load(res.data);

        return {
          cookie,
          _csrf: $('input[name=_csrf]').val(),
        };
      });
  };
}
