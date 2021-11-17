# pickk-crawl

> 핔 서비스에 사용되는 크롤러들의 모노레포지토리입니다. 3개의 package로 구성되어 있습니다. <br/>
> 모든 package는 vercel serverless function으로 관리됩니다.
> Vercel Monorepo를 이용하여 배포하였습니다.

## Packages 📦

- [delivery-tracker](https://github.com/DEV-MUGLES/pickk-crawl/tree/master/packages/delivery-tracker): 배송추적을 위해 사용되는 크롤러
- [item-crawl](https://github.com/DEV-MUGLES/pickk-crawl/tree/master/packages/item-crawl): 아이템 정보와 옵션을 수집하기 위해 사용되는 크롤러
- [youtube-crawl](https://github.com/DEV-MUGLES/pickk-crawl/tree/master/packages/youtube-crawl): 유튜브 영상 조회수와 길이를 크롤링

---

## Getting started 🚀

각 패키지들을 실행하기 앞서 vercel과 라이브러리들을 설치해줍니다.

1. 우선 vercel을 전역으로 설치합니다.

   ```sh
   npm i -g vercel
   ```

2. 루트 디렉토리에서 패키지들을 설치합니다.
   ```sh
   yarn install
   ```

## 패키지 개발환경 실행하기

각 패키지를 실행하기 위한 명령어 입니다.

```sh
yarn start:delivery-tracker
yarn start:item-crawl
yarn start:youtube-crawl
```

## 패키지별 Vercel CLI 실행하기

Vercel Monorepo를 통해 배포를 하게되면, Vercel CLI를 루트 디렉토리에서 실행하여야 합니다. ([공식문서](https://vercel.com/docs/concepts/git/monorepos#using-monorepos-with-vercel-cli))

각 프로젝트별로 Vercel CLI를 사용하기 위한 방법은 2가지가 존재합니다.

1. vercel link명령어를 이용하여, vercel 프로젝트를 직접 링크하기.
2. vercel 명령어를 실행하기 전에, 환경변수 VERCEL_ORG_ID, VERCEL_PROJECT_ID를 직접 설정하고, 실행하기

두번째 방식을 수행하는 명령어들을 아래와 같이 추가해주었습니다.

yarn vercel:\[package-name\] <command | path>

예시

```sh
yarn vecel:delivery-tracker deploy --prod
```
