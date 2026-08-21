import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchFootballNewsById } from "@/lib/news";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchFootballNewsById(slug);

  if (!article) return notFound();

  const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
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
      </article>
    </main>
  );
}