import { fetchChunkHtmls } from '../fetchers';

import { CHUNK_FETCHED_HTMLS_DIR_NAME } from '../constants';

const start = parseInt(process.argv[2]);
const end = parseInt(process.argv[3]);

fetchChunkHtmls(CHUNK_FETCHED_HTMLS_DIR_NAME, start, end);
