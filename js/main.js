/* ============================================================
   몽크루 MONGOLIA CREW — shared scripts (vanilla JS, no dependencies)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const fmt = (n) => n.toLocaleString("ko-KR");

  function toast(msg) {
    let t = $(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tm);
    t._tm = setTimeout(() => t.classList.remove("show"), 3200);
  }
  window.mmToast = toast;

  /* ---------- mobile nav ---------- */
  const navBtn = $(".nav-toggle");
  if (navBtn) {
    navBtn.addEventListener("click", () => {
      const nav = $(".main-nav");
      const open = nav.classList.toggle("open");
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- 카드 비주얼: 사진 우선 + 브랜드 라인아트 폴백 ---------- */
  const PHOTOS = {
    gobi: "assets/img/card-gobi.webp",
    night: "assets/img/card-night.webp",
    terelj: "assets/img/card-terelj.webp",
    central: "assets/img/card-central.webp",
    steppe: "assets/img/card-steppe.webp",
    city: "assets/img/card-city.webp"
  };
  function lineart(key) {
    const themes = {
      lake:   { bg: "#DCEAFF", line: "#2F6BFF", horizon: "#2F6BFF" },
      altai:  { bg: "#F3F6F8", line: "#14283D", horizon: "#647184" },
      winter: { bg: "#EEF3F7", line: "#647184", horizon: "#9AACC0" }
    };
    const t = themes[key] || { bg: "#F4E9D8", line: "#14283D", horizon: "#647184" };
    return `<svg class="lineart" viewBox="0 0 400 132" preserveAspectRatio="xMidYMid slice" role="img" aria-label="여행 경로 그래픽">
      <rect width="400" height="132" fill="${t.bg}"/>
      <path d="M-10 116 C 110 98 290 98 410 116" fill="none" stroke="${t.horizon}" stroke-opacity=".38" stroke-width="3" stroke-linecap="round"/>
      <path d="M42 94 C 118 30 182 124 226 78 C 260 44 322 60 366 42" fill="none" stroke="${t.line}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="226" cy="78" r="9" fill="#FF7458"/>
      <circle cx="226" cy="78" r="16" fill="none" stroke="#FF7458" stroke-opacity=".38" stroke-width="3"/>
    </svg>`;
  }
  function sceneMedia(el, key) {
    if (PHOTOS[key]) {
      el.style.backgroundImage = "url('" + PHOTOS[key] + "')";
    } else {
      el.insertAdjacentHTML("afterbegin", lineart(key));
    }
  }
  function sceneParts(key) {
    return {
      attr: PHOTOS[key] ? ` style="background-image:url('${PHOTOS[key]}')"` : "",
      inner: PHOTOS[key] ? "" : lineart(key)
    };
  }
  window.MM_SCENES = { photos: PHOTOS, lineart };
  $$("[data-scene]").forEach((el) => sceneMedia(el, el.dataset.scene));

  /* ---------- 인원별 비용 계산기 ---------- */
  $$("[data-calc]").forEach((root) => {
    const range = $("input[type=range]", root);
    const nOut = $("[data-calc-n]", root);
    const perOut = $("[data-calc-per]", root);
    const saveOut = $("[data-calc-save]", root);
    const fixedEl = $("[data-calc-fixed]", root);
    const varEl = $("[data-calc-var]", root);
    if (!range) return;
    const upd = () => {
      const n = +range.value;
      const fixed = fixedEl ? +fixedEl.value : 420;
      const varc = varEl ? +varEl.value : 35;
      const per = fixed / n + varc;
      const perNext = fixed / (n + 1) + varc;
      nOut.textContent = n;
      perOut.textContent = "약 " + fmt(Math.round(per * 10) / 10) + "만원";
      if (saveOut) {
        if (n >= +range.max) {
          saveOut.innerHTML = "목표 인원이 모두 모였어요. 팀 완성 시 <b>1인 최저가</b>가 확정됩니다.";
        } else {
          const save = Math.round((per - perNext) * 10) / 10;
          saveOut.innerHTML = "지금 <b>1명이 더 합류</b>하면 1인당 <b>약 " + fmt(save) + "만원</b>이 내려갑니다.";
        }
      }
      if (fixedEl) $("[data-calc-fixedv]", root).textContent = fmt(fixed) + "만원";
      if (varEl) $("[data-calc-varv]", root).textContent = fmt(varc) + "만원";
    };
    range.addEventListener("input", upd);
    if (fixedEl) fixedEl.addEventListener("input", upd);
    if (varEl) varEl.addEventListener("input", upd);
    upd();
  });

  /* ---------- 동행 데이터 (예시) ---------- */
  const TRIPS = [
    {
      id: "gobi-0810", title: "남고비 정석 코스 — 욜링암·홍고린엘스·바양작", scene: "gobi", route: "gobi",
      start: "2026-08-10", label: "8/10(월) 출발 · 6박 7일", month: 8,
      cur: 4, goal: 6, priceNow: 118, priceGoal: 103, pay: "safe",
      temp: 40.8, badges: ["본인확인", "여행완료 2회"], resp: "응답 평균 2시간",
      group: "누구나", tags: ["비흡연", "업체 확정", "푸르공"], theme: ["first"], hot: 96
    },
    {
      id: "khv-0821", title: "홉스골 5박 6일 — 몽골의 바다, 여성전용 팀", scene: "lake", route: "khuvsgul",
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
      id: "first-0801", title: "첫 몽골 입문 — 테를지+울란바토르 3박 4일", scene: "terelj", route: "terelj",
      start: "2026-08-01", label: "8/1(토) 출발 · 3박 4일", month: 8,
      cur: 2, goal: 4, priceNow: 62, priceGoal: 54, pay: "direct",
      temp: 36.5, badges: ["본인확인"], resp: "신규 리더",
      group: "커플 1팀 가능", tags: ["첫 몽골", "승마", "주말"], theme: ["first", "horse"], hot: 72
    },
    {
      id: "cent-0828", title: "중부 순환 — 카라코룸·쳉헤르 온천·어르헝 폭포 5박 6일", scene: "central", route: "central",
      start: "2026-08-28", label: "8/28(금) 출발 · 5박 6일", month: 8,
      cur: 3, goal: 6, priceNow: 96, priceGoal: 82, pay: "tbd",
      temp: 38.1, badges: ["본인확인", "여행완료 1회"], resp: "응답 평균 5시간",
      group: "누구나", tags: ["온천", "역사", "업체 미정"], theme: [], hot: 64
    },
    {
      id: "gobi-0724", title: "남고비+테를지 6박 7일 — 마지막 1석", scene: "gobi", route: "gobi",
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
      id: "win-0305", title: "겨울 홉스골 얼음축제 4박 5일 — 2027년 3월", scene: "winter", route: "winter",
      start: "2027-03-05", label: "27/3/5(금) 출발 · 4박 5일", month: 3,
      cur: 1, goal: 4, priceNow: 148, priceGoal: 118, pay: "tbd",
      temp: 37.9, badges: ["본인확인"], resp: "응답 평균 4시간",
      group: "누구나", tags: ["겨울", "얼음축제", "방한 필수"], theme: ["winter"], hot: 41
    },
    {
      id: "photo-0904", title: "초원 감성 사진팀 — 엘승타사르하이+테를지 4박 5일", scene: "steppe", route: "central",
      start: "2026-09-04", label: "9/4(금) 출발 · 4박 5일", month: 9,
      cur: 3, goal: 5, priceNow: 84, priceGoal: 74, pay: "safe",
      temp: 38.6, badges: ["본인확인", "여행완료 1회"], resp: "응답 평균 2시간",
      group: "여성전용", tags: ["사진·별", "미니고비", "비흡연"], theme: ["photo", "star"], hot: 77
    }
  ];
  window.MM_TRIPS = TRIPS;

  function dday(iso) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const d = new Date(iso + "T00:00:00");
    return Math.round((d - today) / 86400000);
  }

  function payLabel(p) {
    if (p === "safe") return '<span class="pay pay-safe"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1 2.7 3v4c0 3.4 2.3 6.2 5.3 7.2 3-1 5.3-3.8 5.3-7.2V3L8 1Zm-.9 8.9L5 7.8l.9-.9 1.2 1.2 3-3 .9.9-3.9 3.9Z"/></svg>크루페이</span>';
    if (p === "direct") return '<span class="pay pay-direct"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v8H2z" opacity=".35"/><path d="M2 3h12v2H2zM2 7h12v1H2z"/></svg>업체 직접계약</span>';
    return '<span class="pay pay-tbd">업체 미정</span>';
  }

  function tripCard(t) {
    const remain = t.goal - t.cur;
    const d = dday(t.start);
    const urgent = remain <= 1 || (d >= 0 && d <= 10);
    const st = remain === 0
      ? '<span class="st st-closed">마감</span>'
      : urgent ? '<span class="st st-urgent">마감 임박</span>' : '<span class="st st-open">모집중</span>';
    const ddayTxt = d >= 0 ? "D-" + d : "출발 완료";
    const pct = Math.min(100, Math.round((t.cur / t.goal) * 100));
    return `
    <article class="card trip-card" data-id="${t.id}">
      <div class="trip-scene"${sceneParts(t.scene).attr}>${sceneParts(t.scene).inner}${st}<span class="match">${ddayTxt}</span></div>
      <div class="trip-body">
        <span class="trip-date mono">${t.label}</span>
        <h3 class="trip-title"><a class="stretch" href="companion-detail.html">${t.title}</a></h3>
        <div class="seatbar ${urgent ? "urgent" : ""}">
          <div class="track"><div class="fill" style="width:${pct}%"></div></div>
          <div class="lab"><span>확정 <strong>${t.cur}</strong> / 목표 ${t.goal}</span><span><strong>${remain}석</strong> 남음</span></div>
        </div>
        <div class="trust-line">
          <span class="temp">${t.temp.toFixed(1)}℃</span>
          ${t.badges.slice(0, 2).map((b) => `<span class="tbadge"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1 2.7 3v4c0 3.4 2.3 6.2 5.3 7.2 3-1 5.3-3.8 5.3-7.2V3L8 1Zm-.9 8.9L5 7.8l.9-.9 1.2 1.2 3-3 .9.9-3.9 3.9Z"/></svg>${b}</span>`).join("")}
          <span class="small muted">· ${t.resp}</span>
        </div>
        <div class="price-row">
          <span class="price-now">${t.priceNow}만원</span>
          <span class="price-note">현재 ${t.cur}인 기준 1인</span>
          <span class="price-goal">완성 시 ${t.priceGoal}만원</span>
        </div>
        <div class="trip-foot">
          ${payLabel(t.pay)}
          <div class="trip-tags">${[t.group, ...t.tags.slice(0, 2)].map((x) => `<span class="tag">${x}</span>`).join("")}</div>
        </div>
      </div>
    </article>`;
  }
  window.mmTripCard = tripCard;

  /* home: 출발 임박 3장 */
  const homeSoon = $("#homeSoon");
  if (homeSoon) {
    const soon = TRIPS.filter((t) => dday(t.start) >= 0)
      .sort((a, b) => (a.goal - a.cur) - (b.goal - b.cur) || dday(a.start) - dday(b.start))
      .slice(0, 3);
    homeSoon.innerHTML = soon.map(tripCard).join("");
  }

  /* ---------- companion browse page ---------- */
  const listEl = $("#tripList");
  if (listEl) {
    const state = { route: "all", seat: "all", pay: false, group: "all", theme: "all", month: "all", sort: "reco" };
    const params = new URLSearchParams(location.search);
    if (params.get("route")) state.route = params.get("route");
    if (params.get("month")) state.month = params.get("month");

    function apply() {
      let r = TRIPS.slice();
      if (state.route !== "all") r = r.filter((t) => t.route === state.route);
      if (state.month !== "all") r = r.filter((t) => String(t.month) === String(state.month));
      if (state.seat === "1") r = r.filter((t) => t.goal - t.cur === 1);
      if (state.seat === "2") r = r.filter((t) => t.goal - t.cur >= 2);
      if (state.pay) r = r.filter((t) => t.pay === "safe");
      if (state.group !== "all") r = r.filter((t) => (state.group === "w" ? t.group === "여성전용" : t.group !== "여성전용"));
      if (state.theme !== "all") r = r.filter((t) => t.theme.includes(state.theme));
      if (state.sort === "reco") r.sort((a, b) => b.hot - a.hot);
      if (state.sort === "soon") r.sort((a, b) => dday(a.start) - dday(b.start));
      if (state.sort === "trust") r.sort((a, b) => b.temp - a.temp);
      if (state.sort === "new") r.sort((a, b) => (b.start > a.start ? 1 : -1));
      $("#resultCount").textContent = r.length;
      listEl.innerHTML = r.length
        ? r.map(tripCard).join("")
        : `<div class="empty-state" style="grid-column:1/-1">
             <b>조건에 맞는 팀이 아직 없어요</b>
             <p>같은 날짜 ±3일, 비슷한 코스로 넓혀 보거나 대기등록을 남겨 주세요.<br>맞는 팀이 생기면 바로 알려 드립니다.</p>
             <div class="flex" style="justify-content:center;margin-top:16px">
               <button class="btn btn-tonal btn-sm" data-reset>필터 초기화</button>
               <a class="btn btn-primary btn-sm" href="#wait">대기등록 하기</a>
             </div>
           </div>`;
      $$("[data-reset]").forEach((b) => b.addEventListener("click", () => {
        state.route = "all"; state.seat = "all"; state.pay = false; state.group = "all"; state.theme = "all"; state.month = "all";
        syncChips(); apply();
      }));
    }
    function syncChips() {
      $$("[data-f]").forEach((c) => {
        const [k, v] = c.dataset.f.split(":");
        const on = k === "pay" ? state.pay : String(state[k]) === v;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    $$("[data-f]").forEach((c) => c.addEventListener("click", () => {
      const [k, v] = c.dataset.f.split(":");
      if (k === "pay") state.pay = !state.pay;
      else state[k] = state[k] === v ? "all" : v;
      syncChips(); apply();
    }));
    const sortSel = $("#sortSel");
    if (sortSel) sortSel.addEventListener("change", () => { state.sort = sortSel.value; apply(); });
    const ft = $("#filterToggle");
    if (ft) ft.addEventListener("click", () => $("#filterCol").classList.toggle("open"));
    syncChips(); apply();
  }

  /* ---------- home hero search → companion page ---------- */
  const heroSearch = $("#heroSearch");
  if (heroSearch) {
    heroSearch.addEventListener("submit", (e) => {
      e.preventDefault();
      const route = $("#hsRoute").value;
      const date = $("#hsDate").value;
      const q = new URLSearchParams();
      if (route !== "all") q.set("route", route);
      if (date) q.set("month", String(new Date(date + "T00:00:00").getMonth() + 1));
      location.href = "companion.html" + (q.toString() ? "?" + q.toString() : "");
    });
  }

  /* ---------- waitlist / demo forms ---------- */
  $$("form[data-demo]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = f.querySelector(".wait-ok");
      if (ok) ok.style.display = "block";
      toast(f.dataset.demo || "접수되었습니다. 베타 오픈 시 가장 먼저 알려 드릴게요.");
      f.reset();
    });
  });

  /* ---------- checklist progress ---------- */
  $$("[data-checklist]").forEach((root) => {
    const boxes = $$("input[type=checkbox]", root);
    const out = $("[data-cl-progress]", root);
    const upd = () => {
      const done = boxes.filter((b) => b.checked).length;
      out.textContent = done + " / " + boxes.length + " 완료";
    };
    boxes.forEach((b) => b.addEventListener("change", upd));
    upd();
  });

  /* ---------- community tabs ---------- */
  const commTabs = $$("[data-board]");
  if (commTabs.length) {
    commTabs.forEach((tab) => tab.addEventListener("click", () => {
      commTabs.forEach((t) => t.classList.toggle("is-on", t === tab));
      const v = tab.dataset.board;
      $$("#postList .post").forEach((p) => {
        p.style.display = v === "all" || p.dataset.type === v ? "" : "none";
      });
    }));
  }

  /* ---------- recruit wizard ---------- */
  const wiz = $("#wizard");
  if (wiz) {
    let step = 1; const MAX = 5;
    const panels = $$(".wiz-panel", wiz);
    const marks = $$(".wiz-steps .ws", wiz);
    const P = { route: "고비 6박 7일", label: "출발일을 선택하세요", cur: 1, goal: 6, price: "", group: "누구나", tags: [] };

    function money() {
      const fixed = +($("#wzFixed").value || 0);
      const varc = +($("#wzVar").value || 0);
      if (!fixed && !varc) return "";
      const per = Math.round((fixed / P.goal + varc) * 10) / 10;
      const now = Math.round((fixed / Math.max(P.cur, 1) + varc) * 10) / 10;
      return { now, per };
    }
    function paint() {
      panels.forEach((p, i) => p.classList.toggle("on", i === step - 1));
      marks.forEach((m, i) => {
        m.classList.toggle("now", i === step - 1);
        m.classList.toggle("done", i < step - 1);
      });
      $("#wzPrev").disabled = step === 1;
      $("#wzNext").textContent = step === MAX ? "모집글 미리보기 완료" : "다음";
      // live preview
      const dateV = $("#wzDate").value;
      const days = $("#wzDays").value;
      P.route = $("#wzRoute").value;
      P.goal = +$("#wzGoal").value || 6;
      P.cur = +$("#wzCur").value || 1;
      P.group = $("#wzGroup").value;
      const m = money();
      const remain = Math.max(P.goal - P.cur, 0);
      const pct = Math.min(100, Math.round((P.cur / P.goal) * 100));
      const label = dateV
        ? new Date(dateV + "T00:00:00").toLocaleDateString("ko-KR", { month: "numeric", day: "numeric", weekday: "short" }) + " 출발 · " + days
        : "출발일 미정 · " + days;
      $("#wzPreview").innerHTML = `
        <article class="card trip-card">
          <div class="trip-scene"${sceneParts($("#wzScene").value).attr}>${sceneParts($("#wzScene").value).inner}<span class="st st-open">모집중</span></div>
          <div class="trip-body">
            <span class="trip-date mono">${label}</span>
            <h3 class="trip-title">${P.route}</h3>
            <div class="seatbar"><div class="track"><div class="fill" style="width:${pct}%"></div></div>
              <div class="lab"><span>확정 <strong>${P.cur}</strong> / 목표 ${P.goal}</span><span><strong>${remain}석</strong> 남음</span></div></div>
            <div class="trust-line"><span class="temp">36.5℃</span><span class="tbadge">본인확인</span><span class="small muted">· 새 리더</span></div>
            ${m ? `<div class="price-row"><span class="price-now">${m.now}만원</span><span class="price-note">현재 ${P.cur}인 기준</span><span class="price-goal">완성 시 ${m.per}만원</span></div>` : ""}
            <div class="trip-foot">${payLabel($("#wzPay").value)}<div class="trip-tags"><span class="tag">${P.group}</span></div></div>
          </div>
        </article>`;
    }
    $("#wzNext").addEventListener("click", () => {
      if (step === MAX) {
        const need = $$("#wizAgree input");
        if (!need.every((c) => c.checked)) { toast("모집 약속 4가지에 모두 동의해야 게시할 수 있어요."); return; }
        $("#wizDone").style.display = "block";
        wiz.querySelector(".wiz-main").style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      step++; paint();
    });
    $("#wzPrev").addEventListener("click", () => { if (step > 1) { step--; paint(); } });
    $$("#wizard input,#wizard select").forEach((el) => el.addEventListener("input", paint));
    paint();
  }

  /* ---------- footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
