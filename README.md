# pickk-crawl

> 핔 서비스에 사용되는 크롤러들의 모노레포지토리입니다. 3개의 package로 구성되어 있습니다. <br/>
> 모든 package는 vercel serverless function으로 관리됩니다.

## Packages 📦

- [delivery-tracker](https://github.com/DEV-MUGLES/pickk-crawl/tree/master/packages/delivery-tracker): 배송추적을 위해 사용되는 크롤러
- [item-crawl](https://github.com/DEV-MUGLES/pickk-crawl/tree/master/packages/item-crawl): 아이템 정보와 옵션을 수집하기 위해 사용되는 크롤러
- [youtube-crawl](https://github.com/DEV-MUGLES/pickk-crawl/tree/master/packages/youtube-crawl): 유튜브 영상 조회수와 길이를 크롤링

---

## Getting started 🚀

각 패키지들을 실행하기 앞서 vercel을 설치 및 vercel 개발환경을 설정해주어야 합니다.

1. 우선 vercel을 전역으로 설치합니다.

   ```sh
   npm i -g vercel
   ```

2. 개발환경 설정을 위해 패키지 디렉토리로 이동한 후, vercel 명령어로 개발환경을 설정합니다.

   ```sh
   cd packages/delivery-tracker && vercel
   ```

3. 패키지 디렉토리에서 start 명령어로 로컬환경에서 실행가능합니다.
   ```sh
   yarn start
   ```
