/* ============================================================
   몽크루 — 콘텐츠 데이터
   ------------------------------------------------------------
   지역·모집글 내용을 바꾸고 싶을 때는 이 파일만 수정하면 됩니다.
   (모집글은 전부 서비스 소개용 예시 데이터입니다)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 지역 12곳 ----------
     id      : 필터·URL에 쓰이는 고유값 (영문, 변경 시 링크도 함께 수정)
     name    : 화면에 표시되는 이름
     en      : 영문 표기 (카드 상단 라벨)
     days    : 권장 일정
     img     : assets/img 안의 카드 사진
     pos     : 카드 사진 초점 (기본 center)
     short   : 카드 한 줄 소개
     home    : true면 홈 화면 지역 섹션에도 노출               */
  var REGIONS = [
    {
      id: "terelj", name: "테를지 · 울란바토르", en: "TERELJ NATIONAL PARK", days: "1–3일",
      img: "card-terelj.webp", home: true,
      short: "도심에서 1시간 반. 거북바위와 초원 승마, 첫 몽골에 가장 알맞은 입문 코스."
    },
    {
      id: "mini-gobi", name: "미니고비 · 엘승타사르하이", en: "ELSEN TASARKHAI", days: "2–4일",
      img: "region-minigobi.webp", home: true,
      short: "울란바토르에서 280km. 짧은 일정으로 사막·초원·낙타를 한 번에 맛보는 인기 코스."
    },
    {
      id: "gobi", name: "남고비 사막", en: "GOBI DESERT", days: "6–8일",
      img: "card-gobi.webp", home: true,
      short: "욜링암 협곡, 홍고린엘스 모래언덕, 바양작. 동행 수요가 가장 큰 몽골 여행의 정석."
    },
    {
      id: "khuvsgul", name: "홉스골 호수", en: "KHUVSGUL LAKE", days: "5–7일",
      img: "region-khuvsgul.webp", home: true,
      short: "'몽골의 바다'라 불리는 북부의 거대 담수호. 침엽수림과 맑은 물, 호숫가 게르."
    },
    {
      id: "tsenkher", name: "쳉헤르 온천", en: "TSENKHER HOT SPRING", days: "중부 코스에 1박", 
      img: "region-tsenkher.webp", home: true,
      short: "초원 한가운데 노천 온천. 중부 순환 코스의 하이라이트이자 피로 회복 포인트."
    },
    {
      id: "kharkhorin", name: "카라코룸 · 어르헝 폭포", en: "KHARKHORIN · ORKHON", days: "4–6일",
      img: "card-central.webp", home: false,
      short: "몽골제국의 옛 수도 하라호름과 어르헝 계곡 폭포. 역사와 자연을 함께 잇는 중부 루트."
    },
    {
      id: "ub", name: "울란바토르 시내", en: "ULAANBAATAR CITY", days: "0.5–1일",
      img: "region-ub.webp", home: false,
      short: "수흐바타르 광장, 간단사원, 캐시미어 쇼핑과 몽골식 바비큐 허르헉까지."
    },
    {
      id: "altai", name: "알타이 타왕복드", en: "ALTAI TAVAN BOGD", days: "9일+",
      img: "region-altai.webp", home: false,
      short: "만년설 봉우리와 독수리 사냥꾼의 땅. 국내선으로 이동하는 경험자용 심화 원정."
    },
    {
      id: "tsaatan", name: "차탕족 순록마을", en: "TSAATAN REINDEER", days: "홉스골에 +2–3일",
      img: "region-tsaatan.webp", home: false,
      short: "홉스골 북부 타이가 숲의 순록 유목민. 말을 타고 들어가는 특별한 문화 경험."
    },
    {
      id: "white-lake", name: "테르힝 차강 호수", en: "TERKHIIN TSAGAAN", days: "중부 코스에 1–2박",
      img: "region-whitelake.webp", home: false,
      short: "화산 호르고와 맞닿은 '하얀 호수'. 호숫가 캠핑과 일몰이 아름다운 중부의 보석."
    },
    {
      id: "tsagaan-suvarga", name: "차강소브라가", en: "TSAGAAN SUVARGA", days: "고비 코스에 포함",
      img: "region-suvarga.webp", home: false,
      short: "수백만 년 침식이 만든 백악 절벽. 고비로 내려가는 길의 첫 번째 감탄 포인트."
    },
    {
      id: "winter", name: "겨울 몽골", en: "WINTER MONGOLIA", days: "12–3월 · 4–6일",
      img: "region-winter.webp", home: true,
      short: "영하 20℃의 설원과 홉스골 얼음축제, 독수리 축제. 여름과는 전혀 다른 몽골."
    }
  ];

  /* 검색·모집 폼 공통 옵션 — 위 REGIONS에서 자동 생성 */
  var REGION_OPTIONS = REGIONS.map(function (r) { return { value: r.id, label: r.name }; });

  /* ---------- 모집글 예시 데이터 ----------
     scene : 카드 사진 키 (main.js PHOTOS 참조)
     route : REGIONS의 id와 연결                                */
  var TRIPS = [
    {
      id: "gobi-0810", title: "남고비 정석 코스 — 욜링암·홍고린엘스·바양작", scene: "gobi", route: "gobi",
      start: "2026-08-10", label: "8/10(월) 출발 · 6박 7일", month: 8,
      cur: 4, goal: 6, priceNow: 118, priceGoal: 103, pay: "safe",
      temp: 40.8, badges: ["본인확인", "여행완료 2회"], resp: "응답 평균 2시간",
      group: "누구나", tags: ["비흡연", "업체 확정", "푸르공"], theme: ["first"], hot: 96
    },
    {
      id: "khv-0821", title: "홉스골 5박 6일 — 몽골의 바다, 여성전용 팀", scene: "khuvsgul", route: "khuvsgul",
      start: "2026-08-21", label: "8/21(금) 출발 · 5박 6일", month: 8,
      cur: 2, goal: 4, priceNow: 132, priceGoal: 112, pay: "safe",
      temp: 39.4, badges: ["본인확인", "여행완료 1회"], resp: "응답 평균 1시간",
      group: "여성전용", tags: ["비흡연", "게르 2인실", "업체 견적 중"], theme: [], hot: 88
    },
    {
      id: "star-0909", title: "달 없는 주간 · 별 관측 특화 고비+중부 7박 8일", scene: "night", route: "gobi",
      start: "2026-09-09", label: "9/9(수) 출발 · 7박 8일", month: 9,
      cur: 5, goal: 6, priceNow: 108, priceGoal: 98, pay: "safe",
      temp: 41.2, badges: ["본인확인", "여행완료 3회", "검증 리더"], resp: "응답 평균 40분",
      group: "누구나", tags: ["사진·별", "삼각대 환영", "업체 확정"], theme: ["star", "photo"], hot: 99
    },
    {
      id: "mini-0814", title: "미니고비+카라코룸 3박 4일 — 주말 낀 단기 코스", scene: "minigobi", route: "mini-gobi",
      start: "2026-08-14", label: "8/14(금) 출발 · 3박 4일", month: 8,
      cur: 3, goal: 5, priceNow: 58, priceGoal: 49, pay: "safe",
      temp: 38.2, badges: ["본인확인", "여행완료 1회"], resp: "응답 평균 3시간",
      group: "누구나", tags: ["단기", "낙타 체험", "금요일 출발"], theme: ["first"], hot: 91
    },
    {
      id: "first-0801", title: "첫 몽골 입문 — 테를지+울란바토르 3박 4일", scene: "terelj", route: "terelj",
      start: "2026-08-01", label: "8/1(토) 출발 · 3박 4일", month: 8,
      cur: 2, goal: 4, priceNow: 62, priceGoal: 54, pay: "direct",
      temp: 36.5, badges: ["본인확인"], resp: "신규 리더",
      group: "커플 1팀 가능", tags: ["첫 몽골", "승마", "주말"], theme: ["first", "horse"], hot: 72
    },
    {
      id: "cent-0828", title: "중부 순환 — 카라코룸·쳉헤르 온천·어르헝 폭포 5박 6일", scene: "central", route: "kharkhorin",
      start: "2026-08-28", label: "8/28(금) 출발 · 5박 6일", month: 8,
      cur: 3, goal: 6, priceNow: 96, priceGoal: 82, pay: "tbd",
      temp: 38.1, badges: ["본인확인", "여행완료 1회"], resp: "응답 평균 5시간",
      group: "누구나", tags: ["온천", "역사", "업체 미정"], theme: [], hot: 64
    },
    {
      id: "tsenk-0904", title: "온천 중심 힐링 — 쳉헤르+테르힝 차강 호수 4박 5일", scene: "tsenkher", route: "tsenkher",
      start: "2026-09-04", label: "9/4(금) 출발 · 4박 5일", month: 9,
      cur: 2, goal: 5, priceNow: 88, priceGoal: 76, pay: "safe",
      temp: 37.6, badges: ["본인확인"], resp: "응답 평균 2시간",
      group: "누구나", tags: ["온천", "느긋한 일정", "호숫가 게르"], theme: [], hot: 69
    },
    {
      id: "gobi-0724", title: "남고비+테를지 6박 7일 — 마지막 1석", scene: "caravan", route: "gobi",
      start: "2026-07-24", label: "7/24(금) 출발 · 6박 7일", month: 7,
      cur: 5, goal: 6, priceNow: 114, priceGoal: 107, pay: "safe",
      temp: 39.8, badges: ["본인확인", "여행완료 2회"], resp: "응답 평균 1시간",
      group: "누구나", tags: ["비흡연", "MIAT 새벽편", "업체 확정 8인 예약"], theme: [], hot: 100
    },
    {
      id: "altai-0915", title: "알타이 타왕복드 9박 10일 — 경험자 심화 원정", scene: "altai", route: "altai",
      start: "2026-09-15", label: "9/15(화) 출발 · 9박 10일", month: 9,
      cur: 3, goal: 5, priceNow: 236, priceGoal: 214, pay: "safe",
      temp: 42.0, badges: ["본인확인", "여행완료 5회", "검증 리더"], resp: "응답 평균 3시간",
      group: "누구나", tags: ["트레킹", "국내선 포함", "체력 상"], theme: ["trek"], hot: 58
    },
    {
      id: "tsaatan-0907", title: "홉스골+차탕족 순록마을 7박 8일 — 말 타고 타이가로", scene: "tsaatan", route: "tsaatan",
      start: "2026-09-07", label: "9/7(월) 출발 · 7박 8일", month: 9,
      cur: 2, goal: 4, priceNow: 168, priceGoal: 146, pay: "safe",
      temp: 40.1, badges: ["본인확인", "여행완료 2회"], resp: "응답 평균 2시간",
      group: "누구나", tags: ["승마 필수", "문화 체험", "체력 중상"], theme: ["trek"], hot: 62
    },
    {
      id: "win-0305", title: "겨울 홉스골 얼음축제 4박 5일 — 2027년 3월", scene: "winter", route: "winter",
      start: "2027-03-05", label: "27/3/5(금) 출발 · 4박 5일", month: 3,
      cur: 1, goal: 4, priceNow: 148, priceGoal: 118, pay: "tbd",
      temp: 37.9, badges: ["본인확인"], resp: "응답 평균 4시간",
      group: "누구나", tags: ["겨울", "얼음축제", "방한 필수"], theme: ["winter"], hot: 41
    },
    {
      id: "photo-0904", title: "초원 감성 사진팀 — 엘승타사르하이+테를지 4박 5일", scene: "steppe", route: "mini-gobi",
      start: "2026-09-04", label: "9/4(금) 출발 · 4박 5일", month: 9,
      cur: 3, goal: 5, priceNow: 84, priceGoal: 74, pay: "safe",
      temp: 38.6, badges: ["본인확인", "여행완료 1회"], resp: "응답 평균 2시간",
      group: "여성전용", tags: ["사진·별", "미니고비", "비흡연"], theme: ["photo", "star"], hot: 77
    }
  ];

  window.MM_REGIONS = REGIONS;
  window.MM_REGION_OPTIONS = REGION_OPTIONS;
  window.MM_TRIPS = TRIPS;
})();
