export default class BaseCrawler {
  public static carrierId: string;
  crawl: any;
  public info: {
    name: string;
    tel: string;
  };

  constructor(protected trackingCode: string) {}
}
