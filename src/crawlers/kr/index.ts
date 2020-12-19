import BaseCrawler from '../base';

export class KRCjlogicsticsCrawler extends BaseCrawler {
  public static carrierId = 'kr.cjlogicstics';

  crawl = () => {
    return {
      message: '대한통운 성공',
    };
  };
}
