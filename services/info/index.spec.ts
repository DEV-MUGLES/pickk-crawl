import faker from 'faker';

import { InfoResult } from 'types';
import * as InfoCrawl from '.';

const { formatResult } = InfoCrawl;

describe('Test InfoCrawlService', () => {
  describe('formatResult', () => {
    const [salePrice, originalPrice] = [
      faker.random.number(),
      faker.random.number(),
    ].sort();
    const inputResult: InfoResult = {
      name: faker.commerce.productName(),
      brandKor: faker.company.companyName(),
      imageUrl: faker.image.imageUrl(),
      originalPrice,
      salePrice,
    };

    const host = 'suare.diskn.com';
    const url = faker.image.imageUrl();

    it('should return null when formatResult get null values', () => {
      expect(formatResult(null, null, null)).toEqual(null);
    });

    it("should't return null in images", () => {
      const result = formatResult(
        {
          ...inputResult,
          images: [faker.image.imageUrl(), null, faker.image.imageUrl(), null],
        },
        host,
        url
      );

      expect(result.images).toEqual(expect.not.arrayContaining([null]));
      expect(result.images.length).toEqual(2);
    });

    it('result.isSoldout should be false when result.isSoldout is null', () => {
      const result = formatResult({ ...inputResult }, host, url);

      expect(result.isSoldout).toEqual(false);
    });
  });
});
