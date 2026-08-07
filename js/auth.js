/* ============================================================
   몽크루 — 회원 인증 공통 모듈 (Supabase Auth)
   ------------------------------------------------------------
   · 카카오 / 구글 소셜 로그인 + 이메일 회원가입·로그인
   · 모든 페이지의 헤더 로그인 상태를 자동으로 갱신
   · js/config.js 에 키가 없으면 "연동 준비 중" 모드로 동작
     (버튼을 눌러도 사이트가 깨지지 않고 안내만 표시)
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.MONGCREW_CONFIG || {};
  var READY = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase);
  var client = null;

  if (READY) {
    client = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  }

  /* ---------- 작은 도우미 ---------- */
  function $(s, el) { return (el || document).querySelector(s); }
  function $all(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function toast(msg) { if (window.mmToast) window.mmToast(msg); else alert(msg); }

  function redirectBase() {
    if (CFG.AUTH_REDIRECT) return CFG.AUTH_REDIRECT;
    return location.origin + "/auth-callback";
  }

  /* 로그인 뒤 돌아갈 페이지 기억 */
  function rememberReturn(url) {
    try { sessionStorage.setItem("mm_return", url || location.pathname + location.search); } catch (e) {}
  }
  function popReturn() {
    var v = "/";
    try {
      v = sessionStorage.getItem("mm_return") || "/";
      sessionStorage.removeItem("mm_return");
    } catch (e) {}
    return v;
  }

  /* ---------- 사용자 표시 정보 정리 ----------
     카카오·구글이 넘겨주는 metadata 키가 서로 달라서 순서대로 탐색 */
  function displayInfo(user) {
    if (!user) return null;
    var m = user.user_metadata || {};
    var name = m.nickname || m.name || m.full_name || m.preferred_username ||
               (user.email ? user.email.split("@")[0] : "크루");
    var avatar = m.avatar_url || m.picture || "";
    var provider = (user.app_metadata && user.app_metadata.provider) || "email";
    var providerKo = { kakao: "카카오", google: "구글", email: "이메일" }[provider] || provider;
    return { name: name, avatar: avatar, email: user.email || "", provider: provider, providerKo: providerKo };
  }

  /* ---------- 헤더 상태 갱신 ---------- */
  function paintHeader(user) {
    var outs = $all("[data-auth-out]");
    var ins = $all("[data-auth-in]");
    if (user) {
      var info = displayInfo(user);
      outs.forEach(function (el) { el.hidden = true; });
      ins.forEach(function (el) {
        el.hidden = false;
        var img = $("[data-auth-avatar]", el);
        var ini = $("[data-auth-initial]", el);
        var nm = $("[data-auth-name]", el);
        if (nm) nm.textContent = info.name;
        if (img && info.avatar) {
          img.src = info.avatar; img.hidden = false;
          if (ini) ini.hidden = true;
        } else {
          if (img) img.hidden = true;
          if (ini) { ini.hidden = false; ini.textContent = info.name.slice(0, 1).toUpperCase(); }
        }
      });
    } else {
      outs.forEach(function (el) { el.hidden = false; });
      ins.forEach(function (el) { el.hidden = true; });
    }
    document.documentElement.classList.toggle("is-signed-in", !!user);
  }

  /* 아바타 드롭다운 열기/닫기 */
  function bindMenu() {
    $all("[data-auth-menu]").forEach(function (menu) {
      var btn = $("[data-auth-menu-btn]", menu);
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = menu.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    document.addEventListener("click", function () {
      $all("[data-auth-menu].open").forEach(function (m) {
        m.classList.remove("open");
        var b = $("[data-auth-menu-btn]", m);
        if (b) b.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 로그인 동작 ---------- */
  function notReady() {
    toast("소셜 로그인 연동을 준비하고 있어요. 관리자라면 js/config.js에 Supabase 키를 입력해 주세요.");
    var note = $("[data-auth-setup-note]");
    if (note) { note.hidden = false; note.scrollIntoView({ behavior: "smooth", block: "center" }); }
  }

  function signInOAuth(provider) {
    if (!READY) return notReady();
    rememberReturn();
    client.auth.signInWithOAuth({
      provider: provider,
      options: { redirectTo: redirectBase() }
    }).then(function (res) {
      if (res.error) toast("로그인을 시작하지 못했어요: " + res.error.message);
    });
  }

  function signUpEmail(email, password, nickname) {
    if (!READY) { notReady(); return Promise.resolve({ ok: false }); }
    return client.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { nickname: nickname || email.split("@")[0] },
        emailRedirectTo: redirectBase()
      }
    }).then(function (res) {
      if (res.error) return { ok: false, message: res.error.message };
      /* 이메일 확인이 켜져 있으면 session이 null로 옴 */
      if (res.data && !res.data.session) {
        return { ok: true, needConfirm: true };
      }
      return { ok: true, needConfirm: false };
    });
  }

  function signInEmail(email, password) {
    if (!READY) { notReady(); return Promise.resolve({ ok: false }); }
    return client.auth.signInWithPassword({ email: email, password: password })
      .then(function (res) {
        if (res.error) return { ok: false, message: res.error.message };
        return { ok: true };
      });
  }

  function signOut() {
    if (!READY) return Promise.resolve();
    return client.auth.signOut().then(function () {
      paintHeader(null);
      location.href = "/";
    });
  }

  function getUser() {
    if (!READY) return Promise.resolve(null);
    return client.auth.getSession().then(function (res) {
      return (res.data && res.data.session && res.data.session.user) || null;
    });
  }

  function updateNickname(nickname) {
    if (!READY) { notReady(); return Promise.resolve({ ok: false }); }
    return client.auth.updateUser({ data: { nickname: nickname } })
      .then(function (res) {
        if (res.error) return { ok: false, message: res.error.message };
        paintHeader(res.data.user);
        return { ok: true };
      });
  }

  /* 로그인해야 볼 수 있는 페이지에서 호출 */
  function requireSignIn() {
    return getUser().then(function (u) {
      if (!u) {
        rememberReturn();
        location.href = "/login";
        return null;
      }
      return u;
    });
  }

  /* ---------- 흔한 오류 메시지를 한국어로 ---------- */
  function koError(msg) {
    if (!msg) return "잠시 후 다시 시도해 주세요.";
    if (/Invalid login credentials/i.test(msg)) return "이메일 또는 비밀번호가 맞지 않아요.";
    if (/already registered/i.test(msg)) return "이미 가입된 이메일이에요. 로그인 탭에서 진행해 주세요.";
    if (/at least 6/i.test(msg) || /Password should/i.test(msg)) return "비밀번호는 6자 이상으로 입력해 주세요.";
    if (/rate limit/i.test(msg)) return "요청이 잠시 몰렸어요. 1분 뒤 다시 시도해 주세요.";
    if (/Email not confirmed/i.test(msg)) return "가입 확인 메일의 링크를 먼저 눌러 주세요.";
    return msg;
  }

  /* ---------- 초기화 ---------- */
  function init() {
    bindMenu();

    /* 헤더의 로그아웃 버튼 */
    $all("[data-auth-signout]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); signOut(); });
    });

    /* 헤더 상태 */
    if (READY) {
      getUser().then(paintHeader);
      client.auth.onAuthStateChange(function (_ev, session) {
        paintHeader(session ? session.user : null);
      });
    } else {
      paintHeader(null);
    }

    /* "로그인이 필요합니다" 표시가 붙은 요소 */
    $all("[data-need-signin]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        getUser().then(function (u) {
          if (!u) {
            e.preventDefault();
            rememberReturn(el.getAttribute("data-need-signin") || undefined);
            toast("로그인 후 이용할 수 있어요.");
            setTimeout(function () { location.href = "/login"; }, 600);
          }
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* ---------- 외부 공개 ---------- */
  window.MongAuth = {
    ready: READY,
    client: client,
    signInKakao: function () { signInOAuth("kakao"); },
    signInGoogle: function () { signInOAuth("google"); },
    signUpEmail: signUpEmail,
    signInEmail: signInEmail,
    signOut: signOut,
    getUser: getUser,
    displayInfo: displayInfo,
    updateNickname: updateNickname,
    requireSignIn: requireSignIn,
    popReturn: popReturn,
    rememberReturn: rememberReturn,
    koError: koError
  };
})();
