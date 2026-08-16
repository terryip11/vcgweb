"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BLOG_CATEGORY_LABELS } from "@/data/blog-posts";
import type { BlogFaqItem, BlogPost, BlogCategory } from "@/types";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const BLOG_CATEGORIES = Object.keys(BLOG_CATEGORY_LABELS) as BlogCategory[];

export default function BlogForm({
  post,
  isNew = false,
}: {
  post?: BlogPost;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [slug, setSlug] = useState(post?.slug ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [metaDescription, setMetaDescription] = useState(
    post?.metaDescription ?? "",
  );
  const [keywords, setKeywords] = useState(post?.keywords.join(", ") ?? "");
  const [category, setCategory] = useState<BlogCategory>(
    post?.category ?? "guide",
  );
  const [body, setBody] = useState(post?.body ?? "");
  const [faq, setFaq] = useState<BlogFaqItem[]>(post?.faq ?? []);
  const [readingMinutes, setReadingMinutes] = useState(
    String(post?.readingMinutes ?? 5),
  );
  const [publishedAt, setPublishedAt] = useState(
    post?.publishedAt
      ? new Date(post.publishedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  );
  const [isActive, setIsActive] = useState(post?.isActive !== false);

  function addFaq() {
    setFaq((prev) => [...prev, { question: "", answer: "" }]);
  }

  function updateFaq(index: number, field: keyof BlogFaqItem, value: string) {
    setFaq((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  function removeFaq(index: number) {
    setFaq((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      keywords: keywords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      category,
      body,
      faq: faq.filter((f) => f.question.trim() && f.answer.trim()),
      readingMinutes: Number(readingMinutes),
      publishedAt,
      isActive,
    };

    try {
      const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${slug}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string; slug?: string };
      if (!res.ok) {
        setError(data.error ?? "儲存失敗");
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("網絡錯誤，請重試");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate() {
    if (!post || !confirm("確定要下架此文章？")) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/blog/${post.slug}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "下架失敗");
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("網絡錯誤，請重試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Slug {isNew && "*"}
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={!isNew}
            placeholder="hk-personal-loan-apr-guide"
            required
            className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-500`}
          />
          <p className="mt-1 text-xs text-slate-400">網址：/blog/{slug || "..."}</p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            分類
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as BlogCategory)}
            className={inputClass}
          >
            {BLOG_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {BLOG_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            標題 *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            摘要（列表及 GEO 用）
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            SEO Meta Description
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            SEO 關鍵字（逗號分隔）
          </label>
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            閱讀分鐘 / 發佈時間
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={1}
              value={readingMinutes}
              onChange={(e) => setReadingMinutes(e.target.value)}
              className={inputClass}
            />
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          文章內容
        </label>
        <p className="mb-2 text-xs text-slate-400">
          支援 ## 標題、### 小標、- 列表、[文字](/compare) 內部連結
        </p>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={16}
          className={`${inputClass} font-mono text-xs leading-relaxed`}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-500">
            FAQ（SEO / GEO 結構化資料）
          </label>
          <button
            type="button"
            onClick={addFaq}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            + 新增問題
          </button>
        </div>
        <div className="space-y-3">
          {faq.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <input
                value={item.question}
                onChange={(e) => updateFaq(index, "question", e.target.value)}
                placeholder="問題"
                className={`${inputClass} mb-2`}
              />
              <textarea
                value={item.answer}
                onChange={(e) => updateFaq(index, "answer", e.target.value)}
                placeholder="答案"
                rows={2}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="mt-2 text-xs text-red-600 hover:underline"
              >
                移除
              </button>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded border-slate-300"
        />
        發佈顯示
      </label>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "儲存中…" : "儲存文章"}
        </button>
        {!isNew && post && (
          <>
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              預覽
            </a>
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={loading}
              className="rounded-xl border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              下架文章
            </button>
          </>
        )}
      </div>
    </form>
  );
}
