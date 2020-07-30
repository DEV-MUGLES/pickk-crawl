## How Item Info Crawler Works

### CrawlService

모든 요청을 처리하는 service다.
constructor, crawl이 순서대로 실행된다.

**1. constructor**

url, host, selector를 설정합니다.

- url : query parameter로 받은 값을 encode해서 저장한다.
- host : 입력된 url의 hostname에서 'www.'을 제거해서 저장한다. 특별한 case는 getHostName 함수 내부에서 관리한다.
- selector : selecters.yml에 해당 host에 대한 값이 존재할 경우 그 값을, 없으면 base 값을 저장한다.

**2. crawl**

1. host가 phanties에 포함될 경우 option crawler에 그대로 요청하고 그 response를 그대로 반환한다.
2. crawlers에서 해당 host의 crawler가 별도로 정의되어 있는지 찾는다.(crawlerName을 이용한다.) 있으면 그 함수를 실행하고, 없으면 selectors를 이용해 일반적인 select를 수행한다. (select detail은 후술)
3. images를 제외한 항목들에 대한 correct 과정을 거친다. (detail은 후술)
4. result.images의 imageUrl들에 대한 correct과정을 거친다. (detail은 후술)
5. brandNames에서 해당 host의 brandName이 정의되어 있으면 그 값을 그대로 쓴다. (brandHost를 이용한다.)
6. 완성된 결과값을 반환한다.

### Select

1. price에 대해서, select한 결과string에서 숫자 이외의 값을 모두 제거한 뒤 Number로 변환한다. (ex : "30수민10" -> 3010)

### Correct

크게 images에 대한 correct와 그 외 필드에 대한 correct로 나뉜다.

**1. images**

상대 경로에 대한 처리가 되어있지 않다. (ex: ../web/images/213213.jpg)

- imageUrl이 '//'로 시작함 : 앞에 'https:'를 붙인다.
- imageUrl이 '/'로 시작함 : 앞에 baseUrl을 붙인다.
- 그 외 : 수정하지 않음

**2. images 외**

아래 내용을 순서대로 적용한다.

- originalPrice나 salePrice가 0임 : 두 값을 같게 한다.
- originalPrice가 sa
- imageUrl이 '/'로 시작함 : 앞에 'https:'를 붙인다.
- name에서 '[29CM단독] '을 제거한다.
- name.trim()을 실행한다.
