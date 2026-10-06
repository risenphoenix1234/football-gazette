// app/(site)/news/[slug]/page.tsx (replaces existing file)
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getArticleDetail, getMoreNews } from "@/lib/news";

interface Props {
  params: Promise<{ slug: string }>;
}

// Strips HTML tags so the article body can be used as a plain-text
// fallback description when there's no excerpt.
function toPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

// Builds the link preview (WhatsApp, X, Facebook, LinkedIn, Slack, etc.)
// shown when an article URL is pasted somewhere.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleDetail(slug);

  if (!article) {
    return { title: "Article not found | Football Gazette" };
  }

  const description = truncate(
    article.description ||
      toPlainText(article.bodyHtml ?? "") ||
      article.content ||
      "Football news from Football Gazette",
    200
  );

  const images = article.image
    ? [{ url: article.image, width: 1200, height: 630, alt: article.title }]
    : undefined;

  return {
    title: `${article.title} | Football Gazette`,
    description,
    alternates: article.isOwn ? { canonical: article.url } : undefined,
    openGraph: {
      type: "article",
      siteName: "Football Gazette",
      title: article.title,
      description,
      url: article.isOwn ? article.url : undefined,
      images,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleDetail(slug);

  if (!article) return notFound();

  // Old links like /news/own-8 (or a renamed headline) get sent to the
  // current title URL, e.g. /news/own-8-arsenal-beat-chelsea.
  if (article.isOwn && `/news/${slug}` !== article.url) {
    permanentRedirect(article.url);
  }

  const moreNews = await getMoreNews(article.id, 4).catch((err) => {
    console.error("NewsDetailPage: failed to load more news", err);
    return [];
  });

  // Our own article dates are already a formatted display string (e.g.
  // "5 Sept 2026"), not a reliably parseable ISO date — show as-is instead
  // of re-parsing through `new Date()`.
  const publishedDate = article.isOwn
    ? article.publishedAt
    : new Date(article.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[420px] w-full overflow-hidden md:h-[520px]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-10 md:px-8">
          <div className="mx-auto w-full max-w-3xl">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
            >
              ← Back to news
            </Link>

            <span className="mb-3 block w-fit rounded-full bg-purple-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {article.category}
            </span>

            <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
              {article.title}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 aspect-square items-center justify-center rounded-full border-2 border-white bg-purple-600 text-lg font-bold text-white">
                {article.source.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white">{article.author}</p>
                <p className="text-sm text-white/70">
                  {article.source} · {publishedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <article className="mx-auto max-w-3xl px-4 py-12 md:px-8">
        {article.isOwn ? (
          <>
            {article.description && (
              <p className="text-xl font-medium leading-relaxed text-gray-800">
                {article.description}
              </p>
            )}

            <div
              className="prose prose-lg mt-6 max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: article.bodyHtml ?? "" }}
            />

            {article.tags && article.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-gray-200 pt-8">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-xl font-medium leading-relaxed text-gray-800">
              {article.description}
            </p>

            {article.content && (
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                {article.content}
              </p>
            )}

            <div className="mt-10 border-t border-gray-200 pt-8">
              
               <a  href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-700"
              >
                Read full story at {article.source} →
              </a>
            </div>
          </>
        )}
      </article>

      {/* More News */}
      {moreNews.length > 0 && (
        <section className="border-t border-gray-100 bg-[#f5f5f5] py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <h2 className="mb-8 text-2xl font-black uppercase text-black md:text-3xl">
              More News
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {moreNews.map((item) => {
                const isOwn = item.url.startsWith("/news/own-");
                const cardContent = (
                  <article className="group overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-1">
                    <div className="relative h-[160px] w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-purple-600">
                        {item.category}
                      </span>
                      <h3 className="mt-2 text-sm font-bold leading-snug text-black line-clamp-3">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-xs text-gray-500">{item.source}</p>
                    </div>
                  </article>
                );

                return isOwn ? (
                  <Link key={item.id} href={item.url}>
                    {cardContent}
                  </Link>
                ) : (
                  
                  <a key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {cardContent}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}