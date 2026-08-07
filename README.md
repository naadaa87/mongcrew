# 몽크루 MONGOLIA CREW — 웹사이트 (최종 완성본)

> 함께 가는 몽골, 안심되는 동행.
> 일정과 성향이 맞는 몽크루를 찾고, 크루온도와 크루페이로 출발까지 안전하게 확정하는 몽골 특화 동행 플랫폼의 공식 웹사이트입니다.

정적 사이트(HTML/CSS/JS)라 빌드 과정이 없고, **GitHub에 push하면 Cloudflare Pages가 자동으로 배포**합니다.
**카카오·구글·이메일 회원가입/로그인**이 코드에 완성되어 있으며, `js/config.js`에 Supabase 키만 넣으면 실제로 동작합니다 → 순서는 **`docs/로그인-연동-가이드.md`** 참고.

---

## 이번 버전(v3)에서 달라진 것

| 영역 | 내용 |
|---|---|
| 회원 기능 | 카카오·구글·이메일 로그인/회원가입, 마이페이지, 로그인 상태 헤더 (`login`, `mypage`, `auth-callback` + `js/auth.js`) |
| 법적 페이지 | 개인정보처리방침(`privacy`) · 이용약관(`terms`) 초안 — 회원가입·카카오 심사에 필수 |
| 지역 확대 | 지역 가이드 6곳 → **12곳** (테를지·미니고비·남고비·차강소브라가·홉스골·차탕족·쳉헤르·카라코룸·테르힝 차강·울란바토르·알타이·겨울) |
| 직접 입력 | 검색·모집 폼 지역에 **"직접 입력…"** 선택지 — 목록에 없는 곳도 검색/모집 가능 |
| 사진 | 브랜드 촬영 이미지 25장 추가 최적화(webp) — 홈 갤러리 "몽크루가 만드는 순간들", 지역 카드 12종, 각 페이지 히어로 |
| 데이터 분리 | 지역·모집글 예시 데이터를 `js/data.js`로 분리 — 내용 수정 지점 단일화 |
| 주소 체계 | 내부 링크를 확장자 없는 주소(`/companion`)로 통일 — Cloudflare Pages 리다이렉트(308) 제거 |
| 유지보수 도구 | `tools/sync_layout.py`(헤더·푸터 일괄 수정) · `tools/preview.py`(로컬 미리보기) — **저장소에 포함** |
| 캐시 정책 | `_headers` 개선 — `config.js`는 즉시 반영, 사진은 30일 |

---

## 폴더 구조

```
├── index.html              홈 (히어로·통합검색·곧 출발하는 크루·갤러리·지역·대기등록)
├── companion.html          몽크루 찾기 (12지역 필터·직접입력 검색·정렬)
├── companion-detail.html   모집글 상세 (크루온도·크루페이 자금 상태)
├── recruit.html            몽크루 모집하기 (5단계 위저드 — 지역 선택+직접입력)
├── regions.html            지역 가이드 12곳
├── guide.html              여행 준비 · 크루픽
├── trust.html              크루온도·크루페이 센터
├── community.html          크루라운지
├── partners.html           프로크루
├── login.html              로그인 · 회원가입 (카카오/구글/이메일)  ★
├── mypage.html             마이페이지 (프로필·닉네임 변경)         ★
├── auth-callback.html      소셜 로그인 처리 페이지                 ★
├── privacy.html            개인정보처리방침 (초안)                 ★
├── terms.html              이용약관 (초안)                         ★
├── 404.html                없는 주소 안내
├── _headers                Cloudflare Pages 캐시·보안 헤더
├── css/style.css           브랜드 디자인 시스템
├── js/
│   ├── config.js           ★ 로그인 연동 키 — 여기만 채우면 로그인 동작
│   ├── data.js             지역 12곳 · 모집글 예시 (콘텐츠 수정은 여기서)
│   ├── auth.js             회원 인증 공통 모듈
│   └── main.js             검색·필터·계산기·위저드
├── tools/
│   ├── sync_layout.py      헤더·푸터를 15개 페이지에 일괄 반영
│   └── preview.py          로컬 미리보기 서버 (배포와 같은 주소 규칙)
├── docs/
│   └── 로그인-연동-가이드.md  Supabase·카카오·구글 설정 순서
└── assets/
    ├── img/                브랜드 사진 45종 (webp)
    └── logo/               로고·파비콘·앱 아이콘
```

---

## 1. GitHub에 올리기 (처음 한 번)

### 방법 A. 웹에서 (git 설치 불필요)
1. [github.com/new](https://github.com/new)에서 새 저장소 생성 — 이름 예: `mongcrew-site`, README 추가는 체크하지 않음
2. 저장소 화면에서 **"uploading an existing file"** 클릭
3. 이 폴더의 파일·폴더 전체를 드래그해 업로드 → **Commit changes**
   (숨김 파일 `.gitignore`, `_headers`가 빠지지 않게 확인)

### 방법 B. 터미널에서
```bash
cd 이_폴더_경로
git init
git add .
git commit -m "몽크루 웹사이트 v3 — 회원 기능·지역 12곳·최종 완성본"
git branch -M main
git remote add origin https://github.com/<내계정>/mongcrew-site.git
git push -u origin main
```

## 2. Cloudflare Pages 연결 (처음 한 번)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**
2. GitHub 인증 후 `mongcrew-site` 저장소 선택
3. 빌드 설정 — 정적 사이트라 전부 기본값:

   | 항목 | 값 |
   |---|---|
   | Framework preset | **None** |
   | Build command | *(비워두기)* |
   | Build output directory | `/` |

4. **Save and Deploy** → 1분 내 `https://mongcrew-site.pages.dev` 발급

> 기존에 "직접 업로드"로 만든 `mongcrew` 프로젝트는 Git 연동으로 전환할 수 없습니다.
> 새 프로젝트를 Git으로 만들면 되고, 커스텀 도메인이 없는 지금이 갈아타기 가장 좋은 시점입니다.

## 3. 로그인 켜기 (약 30분, 한 번만)

`docs/로그인-연동-가이드.md`를 순서대로 따라 하면 됩니다. 요약:

1. **Supabase** 무료 프로젝트 생성 → URL·anon key를 `js/config.js`에 입력
2. **구글 클라우드 콘솔**에서 OAuth 클라이언트 발급 → Supabase에 등록
3. **카카오 개발자 콘솔**에서 앱 생성 → Supabase에 등록
4. Supabase의 Redirect URLs에 배포 주소의 `/auth-callback` 등록

키를 넣기 전에도 사이트는 정상 동작하며, 로그인 버튼을 누르면 "연동 준비 중" 안내가 표시됩니다.

## 4. 이후 — 지속 업데이트 플로우

```bash
git add .
git commit -m "고비 모집글 3건 추가"
git push        # push 순간 자동 배포 (30초–1분)
```
- 모든 배포는 Deployments 탭에 기록, 문제 시 이전 배포로 1클릭 롤백
- GitHub 웹에서 연필 아이콘(✏️)으로 수정 → Commit 해도 동일하게 배포

**로컬 미리보기:** `python3 tools/preview.py` 실행 후 http://localhost:8000
(배포와 동일한 확장자 없는 주소 규칙을 지원합니다. `python3 -m http.server`로는 `/companion` 같은 주소가 열리지 않아요.)

---

## 5. 콘텐츠 수정 포인트

| 바꾸고 싶은 것 | 위치 |
|---|---|
| 지역 추가·문구 수정 | `js/data.js`의 `REGIONS` + `regions.html` 카드 |
| 모집글 예시 | `js/data.js`의 `TRIPS` 배열 |
| 홈 히어로 문구·통계 | `index.html` 상단 `.hero-photo` |
| 헤더 메뉴·푸터 (전 페이지) | `tools/sync_layout.py` 수정 → `python3 tools/sync_layout.py` 실행 |
| 크루페이·환불·온도 정책 | `trust.html` |
| 개인정보방침·약관 | `privacy.html` · `terms.html` |
| 사진 교체 | `assets/img/`에 webp 추가 후 경로 수정 — **파일명은 새로** (30일 캐시) |
| 색·서체 디자인 토큰 | `css/style.css` 최상단 `:root` |

> **주의:** 헤더·푸터는 `sync_layout.py`가 관리하는 영역(`@HEADER` 마커 사이)입니다.
> HTML에서 직접 고쳐도 되지만, 이후 스크립트를 실행하면 스크립트 내용으로 덮입니다.
> 전 페이지 공통 부분은 스크립트에서 고치는 것을 권장해요.

---

## 6. 오픈 전 체크리스트

- [ ] `docs/로그인-연동-가이드.md` 따라 로그인 연동 (카카오 심사에는 개인정보처리방침 URL 필요 — `privacy` 페이지 주소 사용)
- [ ] 모집글·후기·업체·온도 수치는 전부 **예시 데이터** — 실데이터로 교체
- [ ] 확약금·수수료·기한은 베타 가설값 — PG 계약·법률 자문 후 `trust.html`·`terms.html` 확정
- [ ] `privacy.html`·`terms.html`에 사업자 정보 기입 후 확정본 표기로 변경
- [ ] 대기등록 폼은 데모 동작 — Tally 임베드 또는 Supabase 테이블로 실제 수집 연결
- [ ] `hello@mongcrew.example` 연락처를 실제 값으로 교체
- [ ] 커스텀 도메인 연결 후 `og:image`를 절대 주소로 교체 (카톡 공유 미리보기용)
- [ ] 상표(몽크루/MONGOLIA CREW)·도메인 KIPRIS 유사검색

---

© 2026 몽크루 MONGOLIA CREW
