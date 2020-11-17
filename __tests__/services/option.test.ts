/**
 * @jest-environment node
 */

import OptionCrawlService from '../../services/option';

import testCases from '../data/test-cases.json';
import testHtmls from '../data/test-htmls.json';

jest.setTimeout(100000);

const partnerBrands = testCases
  .map((testCase, index) => ({ ...testCase, html: testHtmls[index] }))
  .filter((testCase) => testCase.isPartner);

let datas;
beforeAll(async () => {
  datas = await Promise.all(
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
});
describe('Test option-crawl (for partners)', () => {
  for (let i = 0; i < partnerBrands.length; ++i) {
    const { name } = partnerBrands[i];
    it(name, (done) => {
      const data = datas[i];
      expect(data).toBeTruthy();
      expect(data.values).toBeTruthy();
      Object.values(data.values).forEach((optionValues) => {
        expect((optionValues as String[]).length).toBeGreaterThan(0);
      });
      done();
    });
  }
});
