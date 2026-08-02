import { requireAdmin } from "@/lib/admin/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return <AdminShell userEmail={user.email}>{children}</AdminShell>;
}
