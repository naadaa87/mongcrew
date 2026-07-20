# 몽크루 MONGOLIA CREW — 웹사이트

> 함께 가는 몽골, 안심되는 동행.
> 일정과 성향이 맞는 몽크루를 찾고, 크루온도와 크루페이로 출발까지 안전하게 확정하는 몽골 특화 동행 플랫폼의 공식 웹사이트입니다.

정적 사이트(HTML/CSS/JS)라 빌드 과정이 없고, **GitHub에 push하면 Cloudflare Pages가 자동으로 배포**하도록 설계되어 있습니다.

---

## 폴더 구조

```
├── index.html              홈 (히어로·통합검색·곧 출발하는 크루·크루페이·지역·프로크루·크루라운지·대기등록)
├── companion.html          몽크루 찾기 (필터·정렬·크루매치 추천)
├── companion-detail.html   모집글 상세 (크루온도·크루페이 자금 상태·신청 카드)
├── recruit.html            몽크루 모집하기 (5단계 위저드 + 실시간 미리보기)
├── trust.html              크루온도·크루페이 센터 (온도 산식·결제 7단계·환불·신고)
├── guide.html              여행 준비 · 크루픽
├── regions.html            지역 가이드 6곳
├── community.html          크루라운지
├── partners.html           프로크루 (입점 플랜·문의)
├── 404.html                없는 주소 안내 (Cloudflare Pages가 자동 사용)
├── _headers                Cloudflare Pages 캐시 정책
├── css/style.css           브랜드 디자인 시스템 (Trust Blue · Deep Navy)
├── js/main.js              검색·필터·계산기·위저드 (외부 의존성 없음)
└── assets/
    ├── img/                브랜드 사진 13종 + OG 이미지
    └── logo/               몽크루 로고 (네이비/화이트, 심벌, 파비콘, 앱 아이콘)
```

---

## 1. 처음 한 번 — GitHub에 올리기

### 방법 A. 웹에서 (git 설치 불필요)
1. [github.com/new](https://github.com/new) 에서 새 저장소 생성 — 이름 예: `mongcrew-site`, **Public/Private 아무거나**, README 추가는 체크하지 않음
2. 저장소 화면에서 **"uploading an existing file"** 클릭
3. 이 폴더의 파일·폴더 전체를 드래그해서 업로드 → **Commit changes**
   (숨김 파일 `.gitignore`, `_headers`가 빠지지 않게 확인)

### 방법 B. 터미널에서
```bash
cd 이_폴더_경로
git init
git add .
git commit -m "몽크루 웹사이트 v2 — 브랜드 확정본"
git branch -M main
git remote add origin https://github.com/<내계정>/mongcrew-site.git
git push -u origin main
```

---

## 2. 처음 한 번 — Cloudflare Pages와 연결

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**
2. GitHub 계정 인증 후 `mongcrew-site` 저장소 선택
3. 빌드 설정 — 정적 사이트라 전부 기본값/비움:

   | 항목 | 값 |
   |---|---|
   | Framework preset | **None** |
   | Build command | *(비워두기)* |
   | Build output directory | `/` |

4. **Save and Deploy** → 1분 내 `https://mongcrew-site.pages.dev` 발급

> 이전에 "Upload assets(직접 업로드)"로 만든 프로젝트가 있다면, 같은 프로젝트에서는 Git 연동으로 전환할 수 없습니다. 새 Pages 프로젝트를 Git으로 만들고, 도메인을 새 프로젝트로 옮기는 방식을 권장합니다.

---

## 3. 이후 — 지속 업데이트 플로우

```bash
# 파일 수정 후
git add .
git commit -m "고비 모집글 3건 추가"
git push
```

push하는 순간 Cloudflare가 자동으로 새 버전을 배포합니다(보통 30초–1분).
- 모든 배포는 **Deployments** 탭에 기록되며, 문제가 생기면 이전 배포로 **1클릭 롤백**할 수 있습니다.
- Pull Request를 만들면 **미리보기 URL**이 자동 생성되어, 반영 전 화면을 먼저 확인할 수 있습니다.
- 웹에서만 작업하려면 GitHub에서 파일을 열어 연필 아이콘(✏️)으로 수정 → Commit 해도 동일하게 배포됩니다.

---

## 4. 커스텀 도메인

Pages 프로젝트 → **Custom domains** → 도메인 입력 → 안내되는 CNAME 레코드 등록.
도메인이 이미 Cloudflare에 있으면 레코드가 자동 추가되고, HTTPS 인증서도 자동 발급됩니다.

---

## 5. 콘텐츠 수정 포인트

| 바꾸고 싶은 것 | 위치 |
|---|---|
| 모집글 예시(제목·날짜·좌석·가격·온도) | `js/main.js`의 `TRIPS` 배열 |
| 홈 히어로 문구·통계 | `index.html` 상단 `.hero-photo` |
| 인원-가격 계산기 기본값 | `index.html`의 `data-calc-fixed`(고정비)·`data-calc-var`(변동비) |
| 크루페이·환불·온도 정책 문구 | `trust.html` |
| 프로크루 요금제 | `partners.html` |
| 사진 교체 | `assets/img/` 에 webp 추가 후 각 HTML의 경로 수정 |
| 색·서체 등 디자인 토큰 | `css/style.css` 최상단 `:root` |

**로컬 미리보기:** 폴더에서 `python3 -m http.server 8000` 실행 후 `http://localhost:8000`

---

## 6. 오픈 전 체크리스트

- [ ] 모집글·후기·업체·온도 수치는 현재 전부 **예시 데이터**입니다 — 실데이터로 교체
- [ ] 확약금·수수료·기한은 베타 가설값 — PG 계약·법률 자문 후 `trust.html` 확정
- [ ] 대기등록/문의 폼은 데모 동작 — Tally, Formspree, 또는 Cloudflare Workers로 실제 수집 연결
- [ ] `hello@mongcrew.example` 등 연락처를 실제 값으로 교체
- [ ] 상표(몽크루/MONGOLIA CREW)·도메인은 상업적 확정 전 KIPRIS 유사검색 권장

---

© 2026 몽크루 MONGOLIA CREW
