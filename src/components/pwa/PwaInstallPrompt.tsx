"use client";

import { useEffect, useState } from "react";

export default function PwaInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        (navigator as Navigator & { standalone?: boolean }).standalone === true);

    if (standalone) return;

    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;

    setIsIOS(ios);

    const dismissed = sessionStorage.getItem("vcg-pwa-install-dismissed");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    sessionStorage.setItem("vcg-pwa-install-dismissed", "1");
    setVisible(false);
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-md rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:bottom-6 sm:left-auto sm:right-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-xs font-bold text-white">
          VCG
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">安裝 VCG App</p>
          {isIOS ? (
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              點 Safari 下方<strong>分享</strong> → <strong>加入主畫面</strong>
              ，即可像 App 一樣快速開啟。
            </p>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              在 Chrome 選單點「安裝應用程式」或「加入主畫面」，方便隨時查詢貸款方案。
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="關閉"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
