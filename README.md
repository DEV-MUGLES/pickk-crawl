## Item Info Crawler

> Vercel Serverless, Cheerio, jest

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

### How to test

```shell script
# fetch test-cases html
$ yarn fetch
# run test
$ yarn jest
```

### API Reference

#### Info Crawl

Get simple info of item crawled by given url

**URL** : `/api/info/?url=[url]`

**Method** : `GET`

**Auth required** : None

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

For host without images selector (not partner)

```json
{
  "name": "아리조나 에바 블랙 129421",
  "brandKor": "버켄스탁",
  "imageUrl": "https://image.msscdn.net/images/goods_img/20160322/324275/324275_2_500.jpg",
  "originalPrice": 59000,
  "salePrice": 44200,
  "images": [],
  "isSoldout": false,
  "url": "https://store.musinsa.com/app/product/detail/324275/0"
}
```

For host with images selector (partner)

```json
{
  "name": "[빅톤 착용] 수아레 유니섹스 365 반팔티 화이트",
  "brandKor": "수아레",
  "imageUrl": "https://image.msscdn.net/images/goods_img/20160322/324275/324275_2_500.jpg",
  "originalPrice": 25000,
  "salePrice": 21250,
  "images": [
    "https://image.examples.com",
    "https://image.examples.com",
    "https://image.examples.com",
    "https://image.examples.com",
    "https://image.examples.com"
  ],
  "isSoldout": false,
  "url": "https://store.musinsa.com/app/product/detail/324275/0"
}
```

#### Option Crawl

Get option/products of item crawled by given url

**URL** : `/api/option/?url=[url]`

**Method** : `GET`

**Auth required** : None

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
  "values": {
    "색상": [
      "블랙",
      "아이보리",
      "포레스트 그린",
      "살몬",
      "잉크블루",
      "그린그로우",
      "소프트베이지",
      "페이디드민트",
      "올리브카키"
    ],
    "사이즈": ["S", "M", "L", "XL"]
  },
  "isSoldout": [
    [0, 0],
    [0, 1],
    ...,
    [7, 3]
  ],
  "optionPriceVariants": [],
  "productPriceVariants": [],
  "url": "https://theknitcompany.com/product/20ss-베이직-울니트/1516/category/5/display/1/"
}
```

## Notes

- For hosts included in the phanties, return results processed in pickk-phantom.

### Deploy with Vercel

[![Deploy with Vercel](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/gywlsp/item-info-crawl)

### 미완

1. 세일중인게 없음 : 코스, 드로우핏, 유니클로, 87mm, 스투시, 반스, 바토즈, 이올로,
2. 세일 아닌게 없음 : 인사일런스, 인로우스,
3. 막혀있음 or 불가능 : 삼성물산, 29cm, 아트닷컴(abc마트, 그랜드스테이지), 무신사 공유링크, 데상트스토어(엄브로, 데상트, 르꼬끄, 먼싱웨어), 하이버, 스타일쉐어, 더패브릭
4. 공홈이 없음 : 커스텀에이드, 트래블, 브랜슨, 지프, 야세, 트리플에이, 페이퍼리즘
5. 브랜드 긁기 불가 : 굿네이션, 레이어 등
6. 정가 긁기 불가 : 로에일(상품페이지에 정가를 안 써놓음)
