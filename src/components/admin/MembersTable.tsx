import Link from "next/link";
import { formatDateTime, USER_ROLE_LABELS } from "@/lib/admin/constants";
import type { AdminMember } from "@/types";

export default function MembersTable({ members }: { members: AdminMember[] }) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-sm text-slate-500">暫無會員</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">會員</th>
              <th className="px-4 py-3">電話</th>
              <th className="px-4 py-3">角色</th>
              <th className="px-4 py-3">查詢數</th>
              <th className="px-4 py-3">註冊時間</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {member.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.avatarUrl}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {(member.fullName ?? member.email ?? "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">
                        {member.fullName ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500">{member.email ?? "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{member.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      member.role === "admin"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {USER_ROLE_LABELS[member.role]}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{member.leadCount}</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {formatDateTime(member.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/members/${member.id}`}
                    className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    詳情
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
