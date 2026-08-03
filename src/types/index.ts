export type LoanCategory =
  | "personal"
  | "sme"
  | "owner"
  | "tax"
  | "business";

export interface Product {
  id: string;
  name: string;
  provider: string;
  category: LoanCategory;
  tagline: string;
  apr: number;
  monthlyFlat?: number;
  maxAmount: number;
  maxTermMonths: number;
  features: string[];
  badges: string[];
  exclusiveOffer?: string;
  applyUrl?: string;
  imageUrl?: string;
  isFeatured: boolean;
  isActive?: boolean;
  sortOrder: number;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  badge?: string;
  expiresAt?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  loanAmount?: number;
  loanCategory?: LoanCategory;
  productId?: string;
  source?: string;
  notes?: string;
  referralCode?: string;
}

export interface SmeScheme {
  id: string;
  name: string;
  maxAmount: string;
  maxTerm: string;
  interestRate: string;
  deadline?: string;
  status: "active" | "ended";
  requirements: string[];
  /** 最新支援措施（如施政報告延長安排） */
  highlights?: string[];
}

export interface MemberProfile {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  role?: UserRole;
  createdAt?: string;
}

export interface MemberLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loanAmount?: number;
  loanCategory?: string;
  status: string;
  source?: string;
  productId?: string;
  createdAt: string;
}

export interface MemberLeadStats {
  total: number;
  pending: number;
  completed: number;
}

export type UserRole = "member" | "admin";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "referred"
  | "closed_won"
  | "closed_lost"
  | "no_response";

export interface AdminLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loanAmount?: number;
  loanCategory?: LoanCategory;
  productId?: string;
  source: string;
  status: LeadStatus;
  notes?: string;
  userId?: string;
  referralCode?: string;
  createdAt: string;
}

export interface AdminDashboardStats {
  todayNew: number;
  pending: number;
  weekTotal: number;
  conversionRate: number;
  total: number;
  bySource: Record<string, number>;
}

export interface AdminClickStats {
  total: number;
  weekTotal: number;
  byProduct: { id: string; count: number }[];
  byCampaign: { id: string; count: number }[];
  bySource: Record<string, number>;
  byReferral: { code: string; clicks: number; leads: number }[];
}

export type MediaEntityType =
  | "lead"
  | "product"
  | "campaign"
  | "profile"
  | "site";

export interface MediaAsset {
  id: string;
  objectKey: string;
  entityType: MediaEntityType;
  entityId?: string;
  category: string;
  originalName?: string;
  mimeType: string;
  sizeBytes: number;
  isPublic: boolean;
  uploadedBy?: string;
  createdAt: string;
  url?: string;
}

export interface AdminProductInput {
  id: string;
  name: string;
  provider: string;
  category: LoanCategory;
  tagline: string;
  apr: number;
  monthlyFlat?: number | null;
  maxAmount: number;
  maxTermMonths: number;
  features: string[];
  badges: string[];
  exclusiveOffer?: string | null;
  applyUrl?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface AdminCampaignInput {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  badge?: string | null;
  expiresAt?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface AffiliatePartnerPerformanceStats {
  totalClicks: number;
  weekClicks: number;
  totalLeads: number;
  weekLeads: number;
  monthLeads: number;
  /** 查詢 ÷ 點擊 × 100；無點擊時為 null */
  conversionRate: number | null;
}

export interface AffiliateTopPerformer {
  referralCode: string;
  partnerName: string;
  weekLeads: number;
  weekClicks: number;
  totalLeads: number;
}

export interface AffiliatePartner {
  id: string;
  name: string;
  email?: string;
  phone: string;
  channel?: string;
  website?: string;
  audience?: string;
  referralCode?: string;
  userId?: string;
  commissionCplHkd?: number;
  status: "pending" | "approved" | "rejected" | "suspended";
  notes?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface AdminAffiliateInput {
  name: string;
  phone: string;
  email?: string | null;
  channel?: string | null;
  website?: string | null;
  audience?: string | null;
  referralCode?: string | null;
  commissionCplHkd?: number | null;
  status?: AffiliatePartner["status"];
  notes?: string | null;
}

export interface AffiliateCommission {
  id: string;
  affiliateId: string;
  periodLabel: string;
  leadCount: number;
  amountHkd: number;
  status: "pending" | "paid" | "void";
  notes?: string;
  createdAt: string;
  paidAt?: string;
}

export interface AffiliateDashboardStats {
  referralCode: string;
  totalClicks: number;
  weekClicks: number;
  totalLeads: number;
  weekLeads: number;
  monthLeads: number;
  commissionCplHkd?: number;
  estimatedPendingHkd?: number;
  paidTotalHkd: number;
  recentLeads: {
    id: string;
    name: string;
    loanCategory?: string;
    status: string;
    createdAt: string;
  }[];
}

export interface AdminMember {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  role: UserRole;
  leadCount: number;
  createdAt: string;
}

export interface AdminMemberInput {
  fullName?: string | null;
  phone?: string | null;
  role?: UserRole;
}
