/* ============================================================
   몽크루 — 서비스 연동 설정
   ------------------------------------------------------------
   이 파일의 값만 채우면 카카오·구글·이메일 로그인이 실제로 동작합니다.
   자세한 설정 순서는 docs/로그인-연동-가이드.md 를 참고하세요.

   1) https://supabase.com 에서 무료 프로젝트 생성
   2) 프로젝트 → Settings → API 에서 아래 두 값 복사
      - Project URL        → SUPABASE_URL
      - anon public key    → SUPABASE_ANON_KEY
   3) Supabase → Authentication → Providers 에서
      Kakao / Google 을 켜고 각 콘솔의 키를 등록
   ------------------------------------------------------------
   ※ anon key는 브라우저에 노출되어도 되는 공개용 키입니다.
     (서버 전용 service_role 키는 절대 이 파일에 넣지 마세요)
   ============================================================ */
window.MONGCREW_CONFIG = {
  SUPABASE_URL: "",       // 예: "https://abcd1234.supabase.co"
  SUPABASE_ANON_KEY: "",  // 예: "eyJhbGciOiJIUzI1NiIs..."

  /* 로그인 후 돌아올 주소. 비워 두면 현재 사이트 주소를 자동 사용합니다.
     Supabase → Authentication → URL Configuration 의
     "Redirect URLs"에도 같은 주소를 등록해야 합니다.
     예: "https://mongcrew.pages.dev/auth-callback"           */
  AUTH_REDIRECT: ""
};
