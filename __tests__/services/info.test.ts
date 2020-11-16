import InfoCrawlService from '../../services/info';
import testCases from '../test-cases.json';

jest.setTimeout(100000);

let datas;
beforeAll(async () => {
  datas = await Promise.all(
    testCases.map(
      ({ url }) =>
        new Promise(async (resolve) => {
          const infoCrawlService = new InfoCrawlService(url);
          const data = await infoCrawlService.crawl();
          resolve(data);
        })
    )
  );
});

describe('Test brands', () => {
  for (let i = 0; i < testCases.length; ++i) {
    const { name, isPartner } = testCases[i];
    it(name, (done) => {
      const data = datas[i];
      expect(data).toBeTruthy();
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
