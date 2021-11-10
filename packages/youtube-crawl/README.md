## youtube-crawl

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

### API Reference

#### viewCount Crawl

유튜브코드를 code파라미터로 요청을 보내면, 조회수를 반환합니다.

**URL** : `/api/view-count?code=[code]`

**Method** : `GET`

**Auth required** : None

**Permissions required** : None

#### Success Response

**Code** : `200 OK`

**Content examples**

request

```http
GET /api/view-count?code=dMBYI7pTR4Q
```

response

```json
49703
```

#### duration Crawl

유튜브코드를 code파라미터로 요청을 보내면, 영상길이를 반환합니다.(ms단위입니다.)

**URL** : `/api/duration?code=[code]`

**Method** : `GET`

**Auth required** : None

**Permissions required** : None

#### Success Response

**Code** : `200 OK`

**Content examples**

request

```http
GET /api/duration?code=dMBYI7pTR4Q
```

response

```json
1639491
```
