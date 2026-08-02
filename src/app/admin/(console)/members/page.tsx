import MembersTable from "@/components/admin/MembersTable";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminMembers } from "@/lib/supabase/admin";

export default async function AdminMembersPage() {
  const { supabase } = await requireAdmin();
  const members = await getAdminMembers(supabase);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">會員管理</h1>
        <p className="mt-1 text-sm text-slate-500">
          查看已註冊會員及其查詢記錄（唯讀）
        </p>
      </div>

      <p className="text-sm text-slate-500">共 {members.length} 位會員</p>
      <MembersTable members={members} />
    </div>
  );
}
