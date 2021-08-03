import fs from 'fs';

import { fetchHtmls } from '../fetchers';

import testCases from '../data/test-cases.json';
import { CHUNK_FETCHED_HTMLS_ROOT_DIR } from '../constants';

export const fetchChunkHtmls = async (folderName: string, start, _end) => {
  const dirPath = `${CHUNK_FETCHED_HTMLS_ROOT_DIR}`;
  try {
    fs.mkdirSync(dirPath);
  } catch (e) {}

  const end = Math.min(_end, testCases.length);
  const fileName = `${folderName}/${start}-${end}`;
  fetchHtmls(fileName, start, end);
};
