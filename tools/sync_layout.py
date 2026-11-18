# -*- coding: utf-8 -*-
"""
몽크루 — 공통 레이아웃 동기화 도구
------------------------------------------------------------
모든 HTML 페이지의 [리본 · 헤더 · 푸터 · 공통 스크립트]를
이 파일에 정의된 내용으로 한 번에 맞춰 줍니다.

사용법 (저장소 최상위 폴더에서):
    python3 tools/sync_layout.py

· 메뉴를 추가·수정하거나 푸터 문구를 바꿀 때 이 파일의
  HEADER / FOOTER 부분만 고친 뒤 실행하면 15개 페이지가 모두 갱신됩니다.
· 각 페이지 본문(<main> 내부)은 건드리지 않습니다.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# 레이아웃을 적용할 페이지와 활성 메뉴 (nav의 href 기준)
PAGES = {
    "index.html": None,
    "companion.html": "companion",
    "companion-detail.html": "companion",
    "recruit.html": None,
    "regions.html": "regions",
    "guide.html": "guide",
    "trust.html": "trust",
    "community.html": "community",
    "partners.html": "partners",
    "login.html": None,
    "mypage.html": None,
    "auth-callback.html": None,
    "privacy.html": None,
    "terms.html": None,
}

RIBBON = """<div class="ribbon">몽크루 비공개 베타를 준비 중입니다 · <a href="/#wait">대기등록</a>하고 오픈 소식과 얼리버드 혜택을 가장 먼저 받아보세요</div>"""

HEADER = """<header class="site-header">
  <div class="container header-inner">
    <a href="/" class="brand" aria-label="몽크루 홈">
      <img class="b-logo" src="assets/logo/logo-ko-navy.png" alt="몽크루 MONGOLIA CREW">
    </a>
    <nav class="main-nav" id="mainNav" aria-label="주요 메뉴">
      <a href="companion">몽크루 찾기</a>
      <a href="regions">지역 가이드</a>
      <a href="guide">여행 준비</a>
      <a href="trust">신뢰·크루페이</a>
      <a href="community">크루라운지</a>
      <a href="partners">프로크루</a>
      <div class="nav-auth-mobile">
        <a data-auth-out href="login">로그인 · 회원가입</a>
        <a data-auth-in hidden href="mypage">마이페이지</a>
      </div>
    </nav>
    <div class="header-actions">
      <div data-auth-out class="flex" style="gap:8px;flex-wrap:nowrap">
        <a class="btn btn-ghost btn-sm" href="login">로그인</a>
        <a class="btn btn-primary btn-sm" href="recruit">몽크루 모집하기</a>
      </div>
      <div data-auth-in class="auth-in" hidden>
        <a class="btn btn-primary btn-sm" href="recruit">몽크루 모집하기</a>
        <div class="avatar-menu" data-auth-menu>
          <button type="button" class="avatar-btn" data-auth-menu-btn aria-haspopup="true" aria-expanded="false" aria-label="내 계정 메뉴">
            <span class="avatar"><img data-auth-avatar alt="" hidden><span data-auth-initial>M</span></span>
            <span class="avatar-name" data-auth-name>크루</span>
            <svg class="ac" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m4 6 4 4 4-4"/></svg>
          </button>
          <div class="avatar-drop">
            <div class="who"><b data-auth-name>크루</b><span>몽크루 멤버 · 크루온도 36.5℃</span></div>
            <div class="sep"></div>
            <a href="mypage">마이페이지</a>
            <a href="recruit">몽크루 모집하기</a>
            <div class="sep"></div>
            <button type="button" data-auth-signout>로그아웃</button>
          </div>
        </div>
      </div>
    </div>
    <button class="nav-toggle" aria-expanded="false" aria-controls="mainNav" aria-label="메뉴 열기">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 5h14M3 10h14M3 15h14"/></svg>
    </button>
  </div>
</header>"""

FOOTER = """<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div>
        <img class="flogo" src="assets/logo/logo-ko-white.png" alt="몽크루 MONGOLIA CREW">
        <p class="fdesc">함께 가는 몽골, 안심되는 동행.<br>일정과 성향이 맞는 몽크루를 찾고, 크루온도와 크루페이로 출발까지 안전하게 확정하는 몽골 특화 동행 플랫폼입니다.</p>
      </div>
      <div>
        <h5>서비스</h5>
        <ul>
          <li><a href="companion">몽크루 찾기</a></li>
          <li><a href="recruit">몽크루 모집하기</a></li>
          <li><a href="regions">지역 가이드</a></li>
          <li><a href="guide">여행 준비 · 크루픽</a></li>
        </ul>
      </div>
      <div>
        <h5>신뢰와 안전</h5>
        <ul>
          <li><a href="trust#temp">크루온도란</a></li>
          <li><a href="trust#pay">크루페이 구조</a></li>
          <li><a href="trust#refund">취소·환불 규정</a></li>
          <li><a href="trust#report">신고 센터</a></li>
        </ul>
      </div>
      <div>
        <h5>회원 · 회사</h5>
        <ul>
          <li><a href="login">로그인 · 회원가입</a></li>
          <li><a href="partners#join">프로크루 입점 안내</a></li>
          <li><a href="community">크루라운지</a></li>
          <li><a href="/#wait">베타 대기등록</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-links">
      <a href="terms">이용약관</a>
      <a href="privacy"><b>개인정보처리방침</b></a>
      <a href="trust#report">신고 센터</a>
    </div>
    <div class="footer-legal">
      <p>몽크루는 여행자 간, 그리고 여행자와 등록 여행업체 간의 연결을 돕는 플랫폼(통신판매중개)이며 여행상품 계약의 당사자가 아닙니다. 상품·일정·요금·환불 의무는 각 판매자(등록 여행업체)에게 있습니다.</p>
      <p>크루페이의 결제 수납·보류·환불은 등록된 전자지급결제대행사(PG)가 처리하며, 몽크루는 약정 조건의 성립 확인과 정산 지시를 담당합니다. 여행자 개인 간 공동경비는 플랫폼이 보관하지 않습니다.</p>
      <p>현재 사이트에 표시된 모집글·가격·후기·업체 정보 일부는 서비스 소개를 위한 예시입니다. 여행 정보는 최종 확인일 기준이며 출발 전 공식 출처를 다시 확인해 주세요.</p>
      <p>© <span data-year>2026</span> 몽크루 MONGOLIA CREW · 문의 hello@mongcrew.example</p>
    </div>
  </div>
</footer>"""

# 모든 페이지 <head>에 들어가는 공통 스크립트 (로그인 상태 표시용)
HEAD_SCRIPTS = """<script defer src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script defer src="js/config.js"></script>
<script defer src="js/auth.js"></script>"""

# 모든 페이지 </body> 직전 공통 스크립트
BODY_SCRIPTS = """<script src="js/data.js"></script>
<script src="js/main.js"></script>
<script defer src="https://choisijun.com/k1.js" integrity="sha384-E7Xl7wiU1vNu5AUY41kJB1uV52L+UEvqwYRzRj4zdaBGAeyRfCll926ETRo39Jm6" crossorigin="anonymous"></script>"""


def replace_block(html: str, name: str, new: str) -> str:
    """<!-- @NAME --> ... <!-- /@NAME --> 마커 사이를 교체 (없으면 그대로)"""
    pat = re.compile(
        r"<!--\s*@" + name + r"\s*-->.*?<!--\s*/@" + name + r"\s*-->",
        re.S,
    )
    block = f"<!-- @{name} -->\n{new}\n<!-- /@{name} -->"
    if pat.search(html):
        return pat.sub(lambda _m: block, html)
    return html


def mark_active(header: str, active: str | None) -> str:
    if not active:
        return header
    return header.replace(
        f'<a href="{active}">',
        f'<a href="{active}" class="is-active">',
        1,
    )


def main() -> int:
    changed = 0
    for name, active in PAGES.items():
        p = ROOT / name
        if not p.exists():
            print(f"  건너뜀 (파일 없음): {name}")
            continue
        html = p.read_text(encoding="utf-8")
        out = html
        out = replace_block(out, "RIBBON", RIBBON)
        out = replace_block(out, "HEADER", mark_active(HEADER, active))
        out = replace_block(out, "FOOTER", FOOTER)
        out = replace_block(out, "HEAD_SCRIPTS", HEAD_SCRIPTS)
        out = replace_block(out, "BODY_SCRIPTS", BODY_SCRIPTS)
        if out != html:
            p.write_text(out, encoding="utf-8")
            changed += 1
            print(f"  갱신: {name}")
    print(f"완료 — {changed}개 페이지의 공통 레이아웃을 맞췄습니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
