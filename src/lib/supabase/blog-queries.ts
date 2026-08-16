import { blogPosts as staticBlogPosts } from "@/data/blog-posts";
import type { BlogPost } from "@/types";
import { createServiceClient } from "./service";
import { createClient } from "./server";

export function getStaticBlogSlugs(): string[] {
  return staticBlogPosts.filter((p) => p.isActive).map((p) => p.slug);
}

function mapBlogRow(row: Record<string, unknown>): BlogPost {
  const faqRaw = row.faq as { question?: string; answer?: string }[] | null;

  return {
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    metaDescription: row.meta_description as string,
    keywords: (row.keywords as string[]) ?? [],
    category: row.category as BlogPost["category"],
    body: row.body as string,
    faq: (faqRaw ?? [])
      .filter((f) => f.question && f.answer)
      .map((f) => ({
        question: f.question!,
        answer: f.answer!,
      })),
    readingMinutes: row.reading_minutes as number,
    isActive: row.is_active as boolean,
    publishedAt: row.published_at as string,
    updatedAt: row.updated_at as string,
  };
}

async function fetchBlogPostsFromDb(limit?: number): Promise<BlogPost[] | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("is_active", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data?.length) return null;
  return data.map(mapBlogRow);
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const fromDb = await fetchBlogPostsFromDb(limit);
  if (fromDb?.length) return fromDb;

  const posts = staticBlogPosts
    .filter((p) => p.isActive)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  return limit ? posts.slice(0, limit) : posts;
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const supabase = await createClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .lte("published_at", new Date().toISOString())
      .maybeSingle();

    if (!error && data) return mapBlogRow(data);
  }

  return staticBlogPosts.find((p) => p.slug === slug && p.isActive) ?? null;
}

async function fetchBlogSlugsFromDb(): Promise<string[] | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_active", true);

  if (error || !data?.length) return null;
  return data.map((row) => row.slug as string);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const fromDb = await fetchBlogSlugsFromDb();
  if (fromDb?.length) return fromDb;
  return getStaticBlogSlugs();
}
