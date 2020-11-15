import InfoCrawlService from '../../services/info';
import testCases from '../test-cases.json';

describe('Test brands', () => {
  for (const testCase of testCases) {
    const { name, url, isPartner } = testCase;
    it(name, async (done) => {
      const infoCrawlService = new InfoCrawlService(url);
      const data = await infoCrawlService.crawl();
      expect(data.brandKor.length).toBeGreaterThan(0);
      expect(data.name.length).toBeGreaterThan(0);
      expect(data.imageUrl.length).toBeGreaterThan(0);
      expect(data.originalPrice).toBeGreaterThan(0);
      expect(data.salePrice).toBeGreaterThan(0);
      if (isPartner) {
        expect(data.images.length).toBeGreaterThan(0);
      }
      done();
    });
  }
});
