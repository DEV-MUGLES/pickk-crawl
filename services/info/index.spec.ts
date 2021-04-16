import { InfoResult } from 'types';
import * as InfoCrawl from '.';

const { formatResult } = InfoCrawl;

describe('Test InfoCrawlService', () => {
  const inputResult: InfoResult = {
    name: '울 오버 싱글 코트 딥네이비',
    brandKor: 'suare',
    imageUrl: 'https://suare.diskn.com/1moTokNIXG',
    originalPrice: 10000,
    salePrice: 9000,
  };

  const host = 'suare.diskn.com';
  const url =
    'http://suare.co.kr/product/detail.html?product_no=1097&cate_no=24&display_group=1';

  it('formatResult should return null when formatResult get null values', () => {
    expect(formatResult(null, null, null)).toEqual(null);
  });

  it("formatResult should't return null in images", () => {
    const result = formatResult(
      {
        ...inputResult,
        images: [
          'https://suare.diskn.com/1moTokNIXG',
          null,
          'https://suare.diskn.com/1moTokNIXG',
          null,
        ],
      },
      host,
      url
    );

    expect(result.images).toEqual(expect.not.arrayContaining([null]));
    expect(result.images.length).toEqual(2);
  });

  it('formatResult result.isSoldout is false when result.isSoldout is null', () => {
    const result = formatResult({ ...inputResult }, host, url);

    expect(result.isSoldout).toEqual(false);
  });
});
