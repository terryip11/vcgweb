import type { AdminClickStats } from "@/types";

export default function ClickStatsPanel({ stats }: { stats: AdminClickStats }) {
  const sourceEntries = Object.entries(stats.bySource).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        以下數據僅統計香港 IP 的點擊及查詢；同一香港 IP 對同一 ref 24 小時內只計 1 次點擊，同一電話 24 小時內只計 1 宗查詢。海外或 VPN 流量不計入。
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">總點擊數（香港 IP）</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">本週點擊（香港 IP）</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats.weekTotal}
          </p>
        </div>
      </div>

      {stats.byProduct.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">
            產品點擊排行（香港 IP）
          </h2>
          <ul className="space-y-2">
            {stats.byProduct.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-900">{item.id}</span>
                <span className="font-bold text-blue-600">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.byCampaign.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">
            活動點擊排行（香港 IP）
          </h2>
          <ul className="space-y-2">
            {stats.byCampaign.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-900">{item.id}</span>
                <span className="font-bold text-orange-600">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sourceEntries.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">
            點擊來源（香港 IP）
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sourceEntries.map(([source, count]) => (
              <div
                key={source}
                className="rounded-xl bg-slate-50 px-4 py-3 text-sm"
              >
                <p className="font-medium text-slate-900">{source}</p>
                <p className="text-xs text-slate-500">{count} 次</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.byReferral.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">
            推廣代碼 (ref) 成效
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-slate-100 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">代碼</th>
                  <th className="px-3 py-2">點擊</th>
                  <th className="px-3 py-2">查詢</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.byReferral.map((item) => (
                  <tr key={item.code}>
                    <td className="px-3 py-2 font-mono font-semibold text-teal-700">
                      {item.code}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{item.clicks}</td>
                    <td className="px-3 py-2 font-bold text-blue-600">
                      {item.leads}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stats.total === 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">暫無香港 IP 點擊數據</p>
          <p className="mt-1 text-xs text-slate-400">
            用戶由香港 IP 點擊「立即申請」或活動橫幅 CTA 後會開始記錄
          </p>
        </div>
      )}
    </div>
  );
}
