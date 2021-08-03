import chalk from 'chalk';
import { execSync } from 'child_process';

import testCases from '../data/test-cases.json';
import { CHUNK_FETCHED_HTMLS_ROOT_DIR } from '../constants';

const { cyan, blue } = chalk;

const fetchChunkHtmlsAll = async (chunkSize: number) => {
  console.log(cyan.inverse(' CHUNK SIZE ') + ` ${chunkSize}`);

  const fetchTimes = Math.floor(testCases.length / chunkSize) + 1;
  [...Array(fetchTimes)].forEach(async (_, i) => {
    const start = i * chunkSize;
    const end = Math.min((i + 1) * chunkSize, testCases.length) - 1;
    console.log('\n' + blue.inverse(' FETCHING ') + ` ${start} - ${end}`);
    execSync(`yarn fetch:chunk ${start} ${end}`, { stdio: 'inherit' });
  });
};

const CHUNK_SIZE = 60;

execSync(`rm -rf ${CHUNK_FETCHED_HTMLS_ROOT_DIR}`);
fetchChunkHtmlsAll(CHUNK_SIZE);
