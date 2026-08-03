"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MemberFormDialog from "@/components/admin/MemberFormDialog";
import { formatDateTime, USER_ROLE_LABELS } from "@/lib/admin/constants";
import type { AdminMember } from "@/types";

function MemberActions({
  member,
  currentUserId,
  onEdit,
}: {
  member: AdminMember;
  currentUserId?: string;
  onEdit: (member: AdminMember) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const isSelf = member.id === currentUserId;

  async function handleDelete() {
    if (isSelf) {
      window.alert("無法刪除自己的帳戶");
      return;
    }

    if (
      !window.confirm(
        `確定刪除會員「${member.fullName ?? member.email ?? member.id}」？此操作無法復原，相關登入帳戶將一併移除。`,
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        window.alert(data.error ?? "刪除失敗");
        return;
      }
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/members/${member.id}`}
        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
      >
        詳情
      </Link>
      <button
        type="button"
        onClick={() => onEdit(member)}
        className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
      >
        編輯
      </button>
      {!isSelf && (
        <button
          type="button"
          disabled={deleting}
          onClick={() => void handleDelete()}
          className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
        >
          {deleting ? "刪除中…" : "刪除"}
        </button>
      )}
    </div>
  );
}

function MemberCard({
  member,
  currentUserId,
  onEdit,
}: {
  member: AdminMember;
  currentUserId?: string;
  onEdit: (member: AdminMember) => void;
}) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {member.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.avatarUrl}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            {(member.fullName ?? member.email ?? "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">
            {member.fullName ?? "—"}
          </p>
          <p className="truncate text-xs text-slate-500">
            {member.email ?? "—"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            member.role === "admin"
              ? "bg-purple-50 text-purple-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {USER_ROLE_LABELS[member.role]}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div>
          <dt className="text-slate-400">電話</dt>
          <dd className="font-medium">{member.phone ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-400">查詢數</dt>
          <dd className="font-medium">{member.leadCount}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-slate-400">註冊時間</dt>
          <dd className="font-medium">{formatDateTime(member.createdAt)}</dd>
        </div>
      </dl>
      <div className="mt-3">
        <MemberActions
          member={member}
          currentUserId={currentUserId}
          onEdit={onEdit}
        />
      </div>
    </article>
  );
}

export default function MembersTable({
  members,
  currentUserId,
}: {
  members: AdminMember[];
  currentUserId?: string;
}) {
  const [editing, setEditing] = useState<AdminMember | null>(null);

  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-sm text-slate-500">暫無會員</p>
        <p className="mt-1 text-xs text-slate-400">
          會員需透過網站註冊／登入後自動建立
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 lg:hidden">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            currentUserId={currentUserId}
            onEdit={setEditing}
          />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
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
                        <p className="text-xs text-slate-500">
                          {member.email ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {member.phone ?? "—"}
                  </td>
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
                    <MemberActions
                      member={member}
                      currentUserId={currentUserId}
                      onEdit={setEditing}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MemberFormDialog
        open={Boolean(editing)}
        title="編輯會員"
        initial={editing ?? undefined}
        memberId={editing?.id}
        onClose={() => setEditing(null)}
      />
    </>
  );
}
