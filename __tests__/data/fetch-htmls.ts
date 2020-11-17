import fs from 'fs';
import chalk from 'chalk';
import Progress from 'progress';

import { requestHtml } from '../../lib';

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
    const htmls = await Promise.all(
      testCases.map(
        ({ name, url }) =>
          new Promise(async (resolve) => {
            try {
              const html = await requestHtml(encodeURI(url));
              bar.tick();
              resolve(html);
            } catch (e) {
              log.fail(name + grey(e.message));
            }
          })
      )
    );
    log.success(`fetch complete!`);
    const path = `${__dirname}/${fileName}.json`;
    fs.writeFileSync(path, JSON.stringify(htmls, undefined, 2), 'utf-8');
    log.success(`${fileName}.json generated ✨`);
  } catch (e) {
    console.log(red.inverse(' Error occured!! '));
    console.log(red(e));
  }
};

fetchHtmls('test-htmls');
