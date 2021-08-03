/**
 * @jest-environment node
 */
import fs from 'fs';
import chalk from 'chalk';

import InfoCrawlService from '../../../services/info';
import { allSettled, getHostName } from '../../../lib';
import infoPuppeties from '../../../services/info/puppeties';

import testCases from '../../data/test-cases.json';
import { CHUNK_FETCHED_HTMLS_ROOT_DIR } from '../../constants';

const files = fs.readdirSync(CHUNK_FETCHED_HTMLS_ROOT_DIR);

for (let i = 0; i < files.length; i++) {
  const fileName = files[i];
  const [start, end] = fileName
    .split('.json')[0]
    .split('-')
    .map((index) => parseInt(index));
  const splittedTestCases = testCases.slice(start, end + 1);

  describe(`Test info-crawl (for all) : ${fileName}`, () => {
    let testHtmls;
    let brands = [];
    let datas = [];
    beforeAll(async () => {
      testHtmls = JSON.parse(
        fs.readFileSync(`${CHUNK_FETCHED_HTMLS_ROOT_DIR}/${fileName}`, 'utf8')
      );

      brands = splittedTestCases.map((testCase, index) => ({
        ...testCase,
        html: testHtmls[testCase.name],
      }));
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
    }, 50000);

    for (let j = 0; j < splittedTestCases.length; ++j) {
      it(splittedTestCases[j].name, () => {
        const { name, html, isPartner, url, skip } = brands[j];

        if (skip) {
          console.log(chalk.yellow(name + ' 스킵됨'));
          return;
        }
        const hostName = getHostName(url);
        const data = datas[j];

        const isFetchFailed =
          (!html && !data) || (!data && infoPuppeties.includes(hostName));
        if (isFetchFailed) {
          console.log(chalk.red(name + 'fetch 실패!'));
          expect(isFetchFailed).toBe(false);
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
      });
    }
  });
}
