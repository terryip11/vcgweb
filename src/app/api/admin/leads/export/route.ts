import { NextResponse } from "next/server";
import { buildCsv } from "@/lib/admin/csv";
import {
  getLeadCategoryLabel,
  getLeadSourceLabel,
  LEAD_STATUS_LABELS,
} from "@/lib/admin/constants";
import { requireAdminApi } from "@/lib/admin/auth";
import { getAdminLeads } from "@/lib/supabase/admin";
import type { LeadStatus } from "@/types";

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (!auth) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "all";
  const source = searchParams.get("source") ?? "all";
  const q = searchParams.get("q") ?? "";

  const leads = await getAdminLeads(auth.supabase, { status, source, search: q });

  const csv = buildCsv(
    [
      "ID",
      "姓名",
      "電話",
      "電郵",
      "貸款類別",
      "貸款金額",
      "來源",
      "推廣代碼",
      "狀態",
      "備註",
      "建立時間",
    ],
    leads.map((lead) => [
      lead.id,
      lead.name,
      lead.phone,
      lead.email ?? "",
      getLeadCategoryLabel(lead),
      lead.loanAmount ?? "",
      getLeadSourceLabel(lead.source),
      lead.referralCode ?? "",
      LEAD_STATUS_LABELS[lead.status as LeadStatus] ?? lead.status,
      lead.notes ?? "",
      lead.createdAt,
    ]),
  );

  const filename = `vcg-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
