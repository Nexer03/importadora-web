import type { Metadata } from "next";

import { ContentPage } from "@/components/layout/ContentPage";
import { legalDocs } from "@/content/legal";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const doc = legalDocs.terminos;

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: `/${doc.slug}` },
};

export default function Page() {
  return <ContentPage doc={doc} />;
}
