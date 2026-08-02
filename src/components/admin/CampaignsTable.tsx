import Link from "next/link";
import { formatDateTime } from "@/lib/admin/constants";
import type { Campaign } from "@/types";

export default function CampaignsTable({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-sm text-slate-500">暫無活動</p>
        <Link
          href="/admin/campaigns/new"
          className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          新增活動
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">活動</th>
              <th className="px-4 py-3">CTA</th>
              <th className="px-4 py-3">到期日</th>
              <th className="px-4 py-3">狀態</th>
              <th className="px-4 py-3">排序</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{campaign.title}</p>
                  <p className="line-clamp-1 text-xs text-slate-500">
                    {campaign.subtitle}
                  </p>
                  {campaign.badge && (
                    <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                      {campaign.badge}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <p>{campaign.ctaText}</p>
                  <p className="text-xs text-slate-400">{campaign.ctaHref}</p>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {campaign.expiresAt
                    ? formatDateTime(`${campaign.expiresAt}T00:00:00`)
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      campaign.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {campaign.isActive ? "上架" : "下架"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{campaign.sortOrder}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/campaigns/${campaign.id}`}
                    className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    編輯
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
