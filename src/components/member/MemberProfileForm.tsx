"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUpload from "@/components/media/ImageUpload";
import { createClient } from "@/lib/supabase/client";

interface MemberProfileFormProps {
  userId: string;
  initialPhone: string;
  initialAvatarUrl?: string;
}

export default function MemberProfileForm({
  userId,
  initialPhone,
  initialAvatarUrl,
}: MemberProfileFormProps) {
  const router = useRouter();
  const [phone, setPhone] = useState(initialPhone);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setMessage("無法連接伺服器");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ phone: phone.trim() || null, updated_at: new Date().toISOString() })
      .eq("id", userId);

    setSaving(false);
    setMessage(error ? "儲存失敗，請重試" : "已儲存");
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <ImageUpload
        entityType="profile"
        entityId={userId}
        category="avatar"
        label="頭像"
        currentUrl={avatarUrl}
        accept="image/jpeg,image/png,image/webp,image/gif"
        onUploaded={(url) => {
          setAvatarUrl(url);
          router.refresh();
        }}
      />

      <div>
        <label
          htmlFor="member-phone"
          className="mb-1 block text-xs font-semibold text-slate-500"
        >
          聯絡電話
        </label>
        <input
          id="member-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="例如 9123 4567"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? "儲存中…" : "儲存資料"}
      </button>
      {message && (
        <p
          className={`text-center text-xs ${message.includes("失敗") ? "text-red-600" : "text-emerald-600"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
