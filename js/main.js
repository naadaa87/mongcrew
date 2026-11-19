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
    const nav = $(".main-nav");
    const closeNav = () => {
      if (nav && nav.classList.contains("open")) {
        nav.classList.remove("open");
        navBtn.setAttribute("aria-expanded", "false");
      }
    };
    navBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !navBtn.contains(e.target)) closeNav();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
  }

  /* ---------- 카드 비주얼: 사진 우선 + 브랜드 라인아트 폴백 ---------- */
  const PHOTOS = {
    gobi: "assets/img/card-gobi.webp",
    caravan: "assets/img/region-gobi-caravan.webp",
    night: "assets/img/card-night.webp",
    terelj: "assets/img/card-terelj.webp",
    central: "assets/img/card-central.webp",
    steppe: "assets/img/card-steppe.webp",
    city: "assets/img/card-city.webp",
    minigobi: "assets/img/region-minigobi.webp",
    khuvsgul: "assets/img/region-khuvsgul.webp",
    tsenkher: "assets/img/region-tsenkher.webp",
    ub: "assets/img/region-ub.webp",
    altai: "assets/img/region-altai.webp",
    tsaatan: "assets/img/region-tsaatan.webp",
    whitelake: "assets/img/region-whitelake.webp",
    suvarga: "assets/img/region-suvarga.webp",
    winter: "assets/img/region-winter.webp"
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

  /* ---------- 동행 데이터 — js/data.js 에서 관리 ---------- */
  const TRIPS = window.MM_TRIPS || [];
  const REGIONS = window.MM_REGIONS || [];

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
        <h3 class="trip-title"><a class="stretch" href="companion-detail">${t.title}</a></h3>
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

  /* home: 지역 카드 (data.js의 home:true 지역) */
  const homeRegions = $("#homeRegions");
  if (homeRegions) {
    homeRegions.innerHTML = REGIONS.filter((r) => r.home).map((r) => `
      <a class="region-card" href="regions#${r.id}">
        <div class="region-scene" style="background-image:url('assets/img/${r.img}')" role="img" aria-label="${r.name}"></div>
        <div class="region-body"><span class="rk">${r.en} · ${r.days}</span><h3>${r.name}</h3><p>${r.short}</p></div>
      </a>`).join("");
  }
  const hsDate = $("#hsDate");
  if (hsDate) hsDate.min = new Date().toISOString().slice(0, 10);

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
    const state = { route: "all", seat: "all", pay: false, group: "all", theme: "all", month: "all", sort: "reco", q: "" };
    const params = new URLSearchParams(location.search);
    if (params.get("route")) state.route = params.get("route");
    if (params.get("month")) state.month = params.get("month");
    if (params.get("q")) state.q = params.get("q").trim();

    /* 지역 칩을 data.js 기준으로 생성 */
    const routeChips = $("#routeChips");
    if (routeChips) {
      routeChips.innerHTML =
        '<button class="chip" data-f="route:all" aria-pressed="false">전체</button>' +
        REGIONS.map((r) =>
          `<button class="chip" data-f="route:${r.id}" aria-pressed="false">${r.name.split(" · ")[0]}</button>`
        ).join("");
    }
    const qClear = $("#qClear");
    if (qClear) qClear.addEventListener("click", () => { state.q = ""; apply(); });

    function apply() {
      let r = TRIPS.slice();
      if (state.q) {
        const kw = state.q.toLowerCase();
        const rname = (id) => { const g = REGIONS.find((x) => x.id === id); return g ? g.name : ""; };
        r = r.filter((t) => (t.title + " " + t.tags.join(" ") + " " + rname(t.route)).toLowerCase().includes(kw));
      }
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
      const qb = $("#qBadge");
      if (qb) { qb.hidden = !state.q; if (state.q) qb.querySelector("b").textContent = state.q; }
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
        state.route = "all"; state.seat = "all"; state.pay = false; state.group = "all"; state.theme = "all"; state.month = "all"; state.q = ""; const qb = $("#qBadge"); if (qb) qb.hidden = true;
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
      if (route === "__custom") {
        const kw = ($("#hsCustom") && $("#hsCustom").value.trim()) || "";
        if (kw) q.set("q", kw);
      } else if (route && route !== "all" && route !== "") {
        q.set("route", route);
      }
      if (date) q.set("month", String(new Date(date + "T00:00:00").getMonth() + 1));
      location.href = "companion" + (q.toString() ? "?" + q.toString() : "");
    });
  }

  /* ---------- 지역 select 자동 채우기 + "직접 입력" 토글 ---------- */
  $$("select[data-region-select]").forEach((sel) => {
    const withAll = sel.dataset.regionSelect !== "no-all";
    let html = withAll ? '<option value="">전체 지역</option>' : "";
    html += (window.MM_REGION_OPTIONS || []).map((o) => `<option value="${o.value}">${o.label}</option>`).join("");
    html += '<option value="__custom">직접 입력…</option>';
    sel.innerHTML = html;
  });
  $$("[data-custom-toggle]").forEach((sel) => {
    const slot = document.getElementById(sel.dataset.customToggle);
    if (!slot) return;
    const sync = () => {
      const on = sel.value === "__custom";
      slot.classList.toggle("show", on);
      const inp = slot.querySelector("input");
      if (on && inp) inp.focus();
    };
    sel.addEventListener("change", sync);
    sync();
  });

  /* ---------- waitlist / demo forms ---------- */
  /* 대기등록·입점 문의는 최시준 홈페이지 '전체 문의'(choisijun.com/api/lead)에 저장되고 운영자에게 알림이 갑니다 */
  const LEAD_URL = "https://choisijun.com/api/lead";
  const formKind = (f) => f.dataset.kind || (/partners/.test(location.pathname) ? "입점 문의" : /companion/.test(location.pathname) ? "동행 대기등록" : "오픈 알림 신청");
  $$("form[data-demo]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = { kind: formKind(f), page: location.pathname };
      $$("input, select, textarea", f).forEach((el) => {
        if (!el.value || el.type === "submit" || ((el.type === "checkbox" || el.type === "radio") && !el.checked)) return;
        const field = el.closest(".field");
        const label = field && field.querySelector("label") ? field.querySelector("label").textContent.replace("*", "").trim() : "";
        const key = el.name || (el.type === "email" ? "email" : el.tagName === "TEXTAREA" ? "message" : label || el.getAttribute("aria-label") || el.placeholder || "항목");
        data[key] = el.value.trim();
      });
      const btn = f.querySelector("[type=submit]");
      if (btn) btn.disabled = true;
      fetch(LEAD_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(data) })
        .then((r) => {
          if (!r.ok) throw new Error("bad");
          const ok = f.querySelector(".wait-ok");
          if (ok) ok.style.display = "block";
          toast(f.dataset.demo || "접수되었습니다. 베타 오픈 시 가장 먼저 알려 드릴게요.");
          f.reset();
        })
        .catch(() => toast("접수가 완료되지 않았어요. 잠시 후 다시 시도해 주세요."))
        .finally(() => { if (btn) btn.disabled = false; });
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
    const P = { title: "", region: "", cur: 1, goal: 6, group: "누구나" };

    /* 지역 id → 카드 배경 자동 매칭 */
    const ROUTE_SCENE = {
      "terelj": "terelj", "mini-gobi": "minigobi", "gobi": "gobi", "khuvsgul": "khuvsgul",
      "tsenkher": "tsenkher", "kharkhorin": "central", "ub": "ub", "altai": "altai",
      "tsaatan": "tsaatan", "white-lake": "whitelake", "tsagaan-suvarga": "suvarga", "winter": "winter"
    };
    const wzRouteSel = $("#wzRoute");
    if (wzRouteSel) wzRouteSel.addEventListener("change", () => {
      const s = ROUTE_SCENE[wzRouteSel.value];
      if (s) $("#wzScene").value = s;
    });
    function regionName() {
      if (!wzRouteSel) return "";
      if (wzRouteSel.value === "__custom") return ($("#wzCustom").value || "").trim() || "직접 입력 지역";
      const g = REGIONS.find((r) => r.id === wzRouteSel.value);
      return g ? g.name : "";
    }

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
      P.region = regionName();
      P.title = ($("#wzTitle").value || "").trim() || (P.region ? P.region + " 크루 모집" : "제목을 입력해 주세요");
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
            <h3 class="trip-title">${P.title}</h3>
            <div class="seatbar"><div class="track"><div class="fill" style="width:${pct}%"></div></div>
              <div class="lab"><span>확정 <strong>${P.cur}</strong> / 목표 ${P.goal}</span><span><strong>${remain}석</strong> 남음</span></div></div>
            <div class="trust-line"><span class="temp">36.5℃</span><span class="tbadge">본인확인</span><span class="small muted">· 새 리더</span></div>
            ${m ? `<div class="price-row"><span class="price-now">${m.now}만원</span><span class="price-note">현재 ${P.cur}인 기준</span><span class="price-goal">완성 시 ${m.per}만원</span></div>` : ""}
            <div class="trip-foot">${payLabel($("#wzPay").value)}<div class="trip-tags"><span class="tag">${P.region || "지역 미정"}</span><span class="tag">${P.group}</span></div></div>
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

  /* ---------- 상세 페이지 고정 카드 접기/펼치기 (모바일) ---------- */
  const decideCard = $("#decideCard");
  if (decideCard) {
    const handle = $(".dc-handle", decideCard);
    if (handle) handle.addEventListener("click", () => {
      const open = decideCard.classList.toggle("open");
      handle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
