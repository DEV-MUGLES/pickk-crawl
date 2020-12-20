import axios from 'axios';
import cheerio from 'cheerio';

import BaseCrawler from '../base';

const parseStatus = (s: string) => {
  if (s.includes('터미널입고')) return { id: 'at_pickup', text: '상품인수' };
  if (s.includes('배송출고'))
    return { id: 'out_for_delivery', text: '배송출발' };
  if (s.includes('배송완료')) return { id: 'delivered', text: '배송완료' };
  return { id: 'in_transit', text: '이동중' };
};

export class KRLogenCrawler extends BaseCrawler {
  public static carrierId = 'kr.logen';
  public static info = {
    name: '로젠택배',
    tel: '+8215889988',
  };

  crawl = () => {
    return new Promise(async (resolve, reject) => {
      const { data } = await axios.get(
        `https://www.ilogen.com/web/personal/trace/${encodeURI(
          this.trackingCode
        )}`,
        {
          responseType: 'arraybuffer',
        }
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
      const progressTable$ = $(progressTable);

      const shippingInformation = {
        from: {
          name: informationTable$
            .children('tr')
            .eq(3)
            .children('td')
            .eq(1)
            .text()
            .trim(),
          time: null,
        },
        to: {
          name: informationTable$
            .children('tr')
            .eq(3)
            .children('td')
            .eq(3)
            .text()
            .trim(),
          time: null,
        },
        state: null,
        progresses: [],
      };

      progressTable$.children('tr').each((_index, element) => {
        const td = $(element).children('td');
        if (td.eq(0).text().trim() === '') {
          return;
        }
        shippingInformation.progresses.push({
          time: `${td
            .eq(0)
            .text()
            .replace(' ', 'T')
            .replace(/\./g, '-')}:00+09:00`,
          location: {
            name: td.eq(1).text(),
          },
          status: parseStatus(td.eq(2).text()),
          description: this.tdToDescription(td, $),
        });
      });

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

      resolve(shippingInformation);
    });
  };

  tdToDescription = (td: Cheerio, $: CheerioStatic) => {
    const headers = [
      '발송점',
      '도착점',
      '담당직원',
      '인수자',
      '영업소',
      '연락처',
    ];
    return headers
      .map((header, i) => {
        return $(td[i + 2])
          .text()
          .trim() !== ''
          ? `${header}: ${$(td[i + 2])
              .text()
              .trim()}`
          : null;
      })
      .filter((obj) => obj !== null)
      .join(', ');
  };
}
