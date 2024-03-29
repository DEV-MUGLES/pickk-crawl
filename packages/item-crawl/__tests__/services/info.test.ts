/**
 * @jest-environment node
 */
import chalk from 'chalk';

import InfoCrawlService from '../../services/info';
import { allSettled, getHostName } from '../../lib';
import infoPuppeties from '../../services/info/puppeties';

import testCases from '../data/test-cases.json';
import testHtmls from '../data/test-htmls.json';

const brands = testCases.map((testCase) => ({
  ...testCase,
  html: testHtmls[testCase.name],
}));

let datas;
beforeAll(async () => {
  const results = await allSettled(
    brands.map(
      ({ url, html }) =>
        new Promise(async (resolve) => {
          try {
            const infoCrawlService = new InfoCrawlService(url);
            const data = (await infoCrawlService.crawl(html))
              .formatPriceUnit()
              .formatBrandKor()
              .formatImages()
              .formatIsSoldout().result;
            resolve(data);
          } catch (e) {
            resolve(null);
          }
        })
    )
  );
  datas = results.map((result) => result['value']);
}, 70000);

describe('Test info-crawl (for all)', () => {
  for (let i = 0; i < testCases.length; ++i) {
    const { name, html, isPartner, url, skip } = brands[i];
    it(name, (done) => {
      if (skip) {
        console.log(chalk.yellow(name + ' 스킵됨'));
        done();
        return;
      }

      const hostName = getHostName(url);

      const data = datas[i];
      if ((!html && !data) || (!data && infoPuppeties.includes(hostName))) {
        console.log(chalk.red(name + 'fetch 실패!'));
        done();
        return;
      }
      expect(data).toBeTruthy();
      expect(data.brandKor.length).toBeGreaterThan(0);
      expect(data.name.length).toBeGreaterThan(0);
      expect(data.imageUrl.length).toBeGreaterThan(0);
      expect(data.originalPrice).toBeGreaterThan(0);
      expect(data.salePrice).toBeGreaterThan(0);
      if (isPartner) {
        expect(data.brandKor).toEqual(name);
        expect(data.images.length).toBeGreaterThan(0);
      }
      done();
    });
  }
});
