export default class BaseCrawler {
  public static carrierId: string;
  crawl: () => any;

  constructor(protected trackingCode: string) {}
}
