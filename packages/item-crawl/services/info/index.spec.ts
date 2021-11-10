import faker from 'faker';

import { InfoResult } from '../../types';
import InfoCrawlService from '.';

describe('InfoCrawlService', () => {
  describe('format', () => {
    const [salePrice, originalPrice] = [
      faker.datatype.number(),
      faker.datatype.number(),
    ].sort();
    const infoResult: InfoResult = {
      name: faker.commerce.productName(),
      brandKor: faker.company.companyName(),
      imageUrl: faker.image.imageUrl(),
      originalPrice,
      salePrice,
    };

    const url = faker.internet.url();

    const infoCrawlService = new InfoCrawlService(url);

    it('should not return null in images', () => {
      infoCrawlService.result = {
        ...infoResult,
        images: [faker.image.imageUrl(), null, faker.image.imageUrl(), null],
      };

      const { result } = infoCrawlService.formatImages();
      expect(result.images).toEqual(expect.not.arrayContaining([null]));
      expect(result.images.length).toEqual(2);
    });

    it('result.isSoldout should be false when result.isSoldout is null', () => {
      infoCrawlService.result = {
        ...infoResult,
        isSoldout: null,
      };

      const { result } = infoCrawlService.formatIsSoldout();
      expect(result.isSoldout).toEqual(false);
    });
  });
});
