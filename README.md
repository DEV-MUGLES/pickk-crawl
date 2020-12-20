## Pickk Delivery Tracker

> Vercel Serverless, Cheerio, jest, Sentry

### Getting Started

Need vercel 19.2.0 (Latest) to deploy

```
npm i -g vercel
```

```shell script
# run locally
$ vercel dev
# deploy
$ vercel
```

### Available Carriers

- [x] CJ대한통운 - kr.cjlogistics
- [x] 롯데택배 - kr.lotte
- [x] 한진택배 - kr.hanjin
- [x] 우체국택배
- [x] 로젠택배
- [x] CU편의점택배
- [ ] GSPostbox택배
- [ ] 홈픽
- [ ] 경동택배
- [ ] 일양로지스
- [ ] 건영택배
- [ ] 천일택배

### API Reference

#### Track delivery

Track delivery by given carrierId, trackingCode

**URL** : `/api/carriers/[carrierId]/tracks/[trackingCode]`

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
  "carrier": {
    "id": "kr.cjlogistics",
    "name": "CJ대한통운",
    "tel": "+8215881255"
  },
  "from": {
    "name": "한*",
    "time": "2020-12-15T19:48:50+09:00"
  },
  "to": {
    "name": "최*",
    "time": "2020-12-18T18:18:25+09:00"
  },
  "state": {
    "id": "delivered",
    "text": "배달완료"
  },
  "progresses": [
    {
      "time": "2020-12-15T19:48:50+09:00",
      "status": {
        "id": "at_pickup",
        "text": "상품인수"
      },
      "location": {
        "name": "서울뉴신화"
      },
      "description": "보내시는 고객님으로부터 상품을 인수받았습니다"
    },
    {
      "time": "2020-12-16T18:06:20+09:00",
      "status": {
        "id": "in_transit",
        "text": "상품이동중"
      },
      "location": {
        "name": "마포1"
      },
      "description": "물류터미널로 상품이 이동중입니다."
    },
    {
      "time": "2020-12-17T11:04:11+09:00",
      "location": {
        "name": "곤지암Hub"
      },
      "description": "해당 물품은 12월 18일 배송 예정입니다."
    },
    {
      "time": "2020-12-17T14:22:59+09:00",
      "status": {
        "id": "in_transit",
        "text": "상품이동중"
      },
      "location": {
        "name": "곤지암Hub"
      },
      "description": "배송지역으로 상품이 이동중입니다."
    },
    {
      "time": "2020-12-18T10:33:48+09:00",
      "status": {
        "id": "in_transit",
        "text": "상품이동중"
      },
      "location": {
        "name": "동안"
      },
      "description": "고객님의 상품이 배송지에 도착하였습니다.(배송예정:XXX NNN-NNNN-NNNN)"
    },
    {
      "time": "2020-12-18T15:24:36+09:00",
      "status": {
        "id": "out_for_delivery",
        "text": "배송출발"
      },
      "location": {
        "name": "경기안양비산"
      },
      "description": "고객님의 상품을 배송할 예정입니다.(18∼20시)(배송담당:XXX NNN-NNNN-NNNN)"
    },
    {
      "time": "2020-12-18T18:18:25+09:00",
      "status": {
        "id": "delivered",
        "text": "배달완료"
      },
      "location": {
        "name": "경기안양비산"
      },
      "description": "고객님의 상품이 배송완료 되었습니다.(담당사원:XXX NNN-NNNN-NNNN)"
    }
  ]
}
```

### Deploy with Vercel

[![Deploy with Vercel](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/gywlsp/item-info-crawl)
