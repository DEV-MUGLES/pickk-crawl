import axios from 'axios';
import cheerio from 'cheerio';
import { XmlEntities as Entities } from 'html-entities';
// import { JSDOM } from 'jsdom'
import qs from 'querystring';

import BaseCrawler from '../base';

const parseStatus = (s: string) => {
  if (s.includes('집하완료')) return { id: 'at_pickup', text: '상품인수' };
  if (s.includes('배달준비'))
    return { id: 'out_for_delivery', text: '배송출발' };
  if (s.includes('배달완료')) return { id: 'delivered', text: '배송완료' };
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

  crawl = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          'https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm',
          qs.stringify({
            sid1: this.trackingCode,
          })
        )
        .then((res) => {
          // const dom = new JSDOM(res.data)
          // const document = dom.window.document

          const $ = cheerio.load(res.data);

          // const informationTable = document.querySelector('.table_col:nth-child(2)')
          // const progressTable = document.querySelector('.table_col:nth-child(1)')

          const $informationTable = $('.table_col:nth-child(2)');
          const $progressTable = $('.table_col:nth-child(1)');

          return { $, $informationTable, $progressTable };
        })
        .then(({ $, $informationTable, $progressTable }) => {
          // const informations = informationTable.querySelectorAll('td')
          const $informations = $informationTable.find('td');
          const entities = new Entities();

          const from = entities
            .decode($informations.eq(0).html())
            .split('<br>');
          const to = entities.decode($informations.eq(1).html()).split('<br>');

          // const from = informations[0].innerHTML.split('<br>')
          // const to = informations[1].innerHTML.split('<br>')

          if ($informations.length === 0) {
            reject({
              code: 404,
              message: '해당 운송장이 존재하지 않습니다.',
            });
          }

          if ($informationTable.find('tr').length === 3) {
            reject({
              code: 404,
              message: parseTime(
                $informationTable.find('tr:nth-child(2)').eq(0).text()
              ),
            });
          }

          const shippingInformation = {
            from: {
              name: from[0],
              time: from[0]
                ? `${from[1].replace(/\./g, '-')}T00:00:00+09:00`
                : '',
            },
            to: {
              name: to[0],
              time: to[0]
                ? `${parseTime(to[1].replace(/\./g, '-'))}T00:00:00+09:00`
                : '',
            },
            state: null,
            progresses: [],
          };

          $progressTable.find('tr').each((_, element) => {
            const td = $(element).find('td');
            if (td.length === 0) {
              return;
            }
            shippingInformation.progresses.push({
              time: `${td.eq(0).html().replace(/\./g, '-')}T${td
                .eq(1)
                .html()}:00+09:00`,
              location: {
                name: td.eq(2).find('a').eq(0).text(),
              },
              status: parseStatus(td.eq(3).text()),
              description: parseTime(td.eq(3).text()),
            });
          });

          if (shippingInformation.progresses.length > 0)
            shippingInformation.state =
              shippingInformation.progresses[
                shippingInformation.progresses.length - 1
              ].status;
          else
            shippingInformation.state = {
              id: 'information_received',
              text: '방문예정',
            };

          resolve(shippingInformation);
        })
        .catch((err) => reject(err));
    });
  };
}
