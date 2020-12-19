import BaseCrawler from '../crawlers/base';

export default class TrackService {
  private carrierId: string;
  private trackingCode: string;
  private crawler: BaseCrawler;

  constructor(carrierId: string, trackingCode: string) {
    this.carrierId = carrierId;
    this.trackingCode = trackingCode;
  }
}
