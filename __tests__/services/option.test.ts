/**
 * @jest-environment node
 */
import chalk from 'chalk';

import OptionCrawlService from '../../services/option';
import { allSettled, getHostName } from '../../lib';
import optionPuppeties from '../../services/option/puppeties';

import testCases from '../data/test-cases.json';
import testHtmls from '../data/test-htmls.json';

jest.setTimeout(50000);

const partnerBrands = testCases
  .map((testCase) => ({
    ...testCase,
    html: testHtmls[testCase.name],
  }))
  .filter((testCase) => testCase.isPartner);

let datas;
beforeAll(async () => {
  const results = await allSettled(
    partnerBrands.map(
      ({ url, html }) =>
        new Promise(async (resolve) => {
          try {
            const optionCrawlService = new OptionCrawlService(url);
            const data = await optionCrawlService.crawl(html);
            resolve(data);
          } catch (e) {
            console.log(e);
            resolve(null);
          }
        })
    )
  );
  datas = results.map((result) => result['value']);
});

describe('Test option-crawl (for partners)', () => {
  for (let i = 0; i < partnerBrands.length; ++i) {
    const { name, html, url, skip } = partnerBrands[i];
    it(name, (done) => {
      if (skip) {
        console.log(chalk.bgYellow(name + ' 스킵됨'));
        done();
        return;
      }
      const hostName = getHostName(url);

      const data = datas[i];
      if ((!html && !data) || (!data && optionPuppeties.includes(hostName))) {
        console.log(chalk.red(name + 'fetch 실패!'));
        done();
        return;
      }
      expect(data).toBeTruthy();
      expect(data.values).toBeTruthy();
      expect(Object.keys(data.values).length).toBeGreaterThan(0);
      Object.values(data.values).forEach((optionValues) => {
        expect((optionValues as String[]).length).toBeGreaterThan(0);
      });
      done();
    });
  }
});
