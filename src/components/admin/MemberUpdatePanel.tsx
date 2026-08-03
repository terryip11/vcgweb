"use client";

import { useState } from "react";
import MemberFormDialog from "@/components/admin/MemberFormDialog";
import type { AdminMember } from "@/types";

export default function MemberUpdatePanel({ member }: { member: AdminMember }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        編輯會員資料
      </button>

      <MemberFormDialog
        open={open}
        title="編輯會員"
        initial={member}
        memberId={member.id}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
