/**
 * @jest-environment node
 */
import fs from 'fs';
import chalk from 'chalk';

import OptionCrawlService from '../../../services/option';
import { allSettled, getHostName } from '../../../lib';
import optionPuppeties from '../../../services/option/puppeties';

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

  // splittedTestCases에 parter test cases가 없는 경우 테스트를 수행하지 않는다.
  const hasPartner = splittedTestCases.find((testCases) => testCases.isPartner);
  if (!hasPartner) {
    continue;
  }

  const splittedPartnerTestCases = splittedTestCases.filter(
    (testCases) => testCases.isPartner
  );
  describe(`Test option-crawl (for partners) : ${fileName}`, () => {
    let testHtmls;
    let partnerBrands = [];
    let datas = [];
    beforeAll(async () => {
      testHtmls = JSON.parse(
        fs.readFileSync(`${CHUNK_FETCHED_HTMLS_ROOT_DIR}/${fileName}`, 'utf8')
      );
      partnerBrands = splittedPartnerTestCases.map((testCase) => ({
        ...testCase,
        html: testHtmls[testCase.name],
      }));

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
    }, 50000);

    for (let j = 0; j < splittedPartnerTestCases.length; ++j) {
      it(splittedPartnerTestCases[j].name, (done) => {
        const {
          name,
          html,
          url,
          skip,
          skipBlankValuesCheck,
          skipBlankValuesCheckReason,
        } = partnerBrands[j];

        if (skip) {
          console.log(chalk.bgYellow(name + ' 스킵됨'));
          done();
          return;
        }
        const hostName = getHostName(url);
        const data = datas[j];
        if ((!html && !data) || (!data && optionPuppeties.includes(hostName))) {
          console.log(chalk.red(name + 'fetch 실패!'));
          done();
          return;
        }
        expect(data).toBeTruthy();
        expect(data.values).toBeTruthy();
        if (skipBlankValuesCheck) {
          console.log(
            chalk.yellowBright(name + ' 옵션 Values check 스킵됨: ') +
              skipBlankValuesCheckReason
          );
        } else {
          expect(Object.keys(data.values).length).toBeGreaterThan(0);
        }
        Object.values(data.values).forEach((optionValues) => {
          expect((optionValues as String[]).length).toBeGreaterThan(0);
        });
        done();
      });
    }
  });
}
