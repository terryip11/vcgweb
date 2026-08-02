"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";
import type { User } from "@supabase/supabase-js";

interface AuthButtonProps {
  onNavigate?: () => void;
  className?: string;
}

export default function AuthButton({ onNavigate, className }: AuthButtonProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string | undefined>();
  const [profileName, setProfileName] = useState<string | undefined>();
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;

    async function loadUser() {
      const { data } = await client.auth.getUser();
      const authUser = data.user;
      setUser(authUser);

      if (authUser) {
        const { data: profile } = await client
          .from("profiles")
          .select("avatar_url, full_name")
          .eq("id", authUser.id)
          .single();

        if (profile?.avatar_url) {
          setProfileAvatar(profile.avatar_url as string);
        }
        if (profile?.full_name) {
          setProfileName(profile.full_name as string);
        }

        try {
          const res = await fetch("/api/affiliate/stats");
          setIsAffiliate(res.ok);
        } catch {
          setIsAffiliate(false);
        }
      } else {
        setIsAffiliate(false);
      }

      setLoading(false);
    }

    void loadUser();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfileAvatar(undefined);
        setProfileName(undefined);
        setIsAffiliate(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    onNavigate?.();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div
        className={`h-9 w-20 animate-pulse rounded-xl bg-slate-100 ${className ?? ""}`}
      />
    );
  }

  if (user) {
    const name =
      profileName ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      user.phone?.replace("+852", "") ||
      "會員";
    const avatar =
      profileAvatar || (user.user_metadata?.avatar_url as string | undefined);

    return (
      <div className={`flex items-center gap-2 ${className ?? ""}`}>
        {isAffiliate && (
          <Link
            href="/affiliate"
            onClick={onNavigate}
            className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
          >
            推廣後台
          </Link>
        )}
        <Link
          href="/member"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
        >
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={name}
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="max-w-[100px] truncate">{name}</span>
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="rounded-xl px-2 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          登出
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      onClick={onNavigate}
      className={`rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 ${className ?? ""}`}
    >
      會員登入
    </Link>
  );
}

export function GoogleSignInButton({
  next = "/member",
}: {
  next?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      setError("無法連接 Supabase");
      return;
    }

    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        skipBrowserRedirect: true,
      },
    });

    if (oauthError) {
      setLoading(false);
      setError(translateAuthError(oauthError.message));
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
      return;
    }

    setLoading(false);
    setError("無法啟動 Google 登入");
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {loading ? "正在跳轉…" : "使用 Google 登入"}
    </button>
    </div>
  );
}
