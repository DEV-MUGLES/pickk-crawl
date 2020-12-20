export default class BaseCrawler {
  public static carrierId: string;
  public static info: {
    name: string;
    tel: string;
  };
  crawl: any;

  constructor(protected trackingCode: string) {}
}
