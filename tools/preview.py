# -*- coding: utf-8 -*-
"""
몽크루 — 로컬 미리보기 서버
------------------------------------------------------------
Cloudflare Pages와 똑같은 주소 규칙(확장자 없는 URL)으로
내 컴퓨터에서 사이트를 미리 봅니다.

사용법 (저장소 최상위 폴더에서):
    python3 tools/preview.py
그다음 브라우저에서  http://localhost:8000  접속

· /companion  →  companion.html 을 보여줌
· /           →  index.html 을 보여줌
· 종료: 터미널에서 Ctrl + C
"""
import http.server
import os
import socketserver
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, path):
        full = super().translate_path(path)
        # /companion 처럼 확장자 없는 요청이면 companion.html을 찾아본다
        if not os.path.exists(full) and "." not in os.path.basename(full):
            candidate = full.rstrip("/") + ".html"
            if os.path.exists(candidate):
                return candidate
        return full

    def log_message(self, fmt, *args):
        sys.stdout.write("  " + (fmt % args) + "\n")


if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"몽크루 미리보기 서버 실행 중 →  http://localhost:{PORT}")
        print("종료하려면 Ctrl + C 를 누르세요.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n서버를 종료했습니다.")
