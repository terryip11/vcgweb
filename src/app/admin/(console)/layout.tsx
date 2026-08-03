import { requireAdmin } from "@/lib/admin/auth";
import AdminShell from "@/components/admin/AdminShell";
import { countPendingAffiliatePartners } from "@/lib/supabase/admin";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user } = await requireAdmin();
  const pendingAffiliateCount = await countPendingAffiliatePartners(supabase);

  return (
    <AdminShell
      userEmail={user.email}
      pendingAffiliateCount={pendingAffiliateCount}
    >
      {children}
    </AdminShell>
  );
}
