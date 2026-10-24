import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyArticle } from "@/components/work/CaseStudyArticle";
import { publishedCaseStudies, templatePreview } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

const isDev = process.env.NODE_ENV === "development";

/** Published, verified studies — plus the template preview in development only. */
function available() {
  return isDev ? [...publishedCaseStudies(), templatePreview] : publishedCaseStudies();
}

export function generateStaticParams() {
  return available().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = available().find((s) => s.slug === slug);
  if (!study) return {};
  const meta = pageMetadata({ title: study.title, description: study.concern, path: `/work/${study.slug}` });
  return study === templatePreview ? { ...meta, robots: { index: false, follow: false } } : meta;
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = available().find((s) => s.slug === slug);
  if (!study) notFound();
  return <CaseStudyArticle study={study} isTemplate={study === templatePreview} />;
}
