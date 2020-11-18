import fs from 'fs';
import chalk from 'chalk';
import Progress from 'progress';

import { allSettled, requestHtml } from '../../lib';

import testCases from './test-cases.json';

const { red, green, grey } = chalk;

const bar = new Progress('fetching htmls... [:bar] :percent :etas', {
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: testCases.length,
});

const log = {
  fail: (message: any) => {
    console.log(red.inverse(' FAIL ') + ' ' + message);
  },
  success: (message: any) => {
    console.log(green.inverse.bold(' SUCCESS ') + ' ' + message);
  },
};

const fetchHtmls = async (fileName: string) => {
  try {
    const htmlDatas = await allSettled(
      testCases.map(
        ({ name, url }) =>
          new Promise(async (resolve) => {
            try {
              const html = await requestHtml(encodeURI(url));
              resolve({ name, html });
            } catch (e) {
              resolve({
                name,
                html: null,
                message: e.toString(),
              });
            } finally {
              bar.tick();
            }
          })
      )
    );
    const failedHtmlDatas = htmlDatas.filter(
      (htmlData) => !htmlData['value']['html']
    );
    failedHtmlDatas.forEach((htmlData) => {
      log.fail(
        `${htmlData['value']['name']}` + grey(htmlData['value']['message'])
      );
    });
    if (failedHtmlDatas.length) {
      console.log('❗실패한 브랜드는 jest 실행시 다시 fetch합니다❗');
    }

    log.success(
      `fetch complete! (${testCases.length - failedHtmlDatas.length}/${
        testCases.length
      })`
    );

    const testHtmls = {};
    htmlDatas.forEach((htmlData) => {
      if (htmlData['value']['html']) {
        testHtmls[htmlData['value']['name']] = htmlData['value']['html'];
      }
    });

    const path = `${__dirname}/${fileName}.json`;
    fs.writeFileSync(path, JSON.stringify(testHtmls, undefined, 2), 'utf-8');
    log.success(`${fileName}.json generated ✨`);
  } catch (e) {
    console.log(red.inverse(' Error occured!! '));
  }
};

fetchHtmls('test-htmls');
