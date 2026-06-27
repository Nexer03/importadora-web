import type { Metadata } from "next";

import { ContentPage } from "@/components/layout/ContentPage";
import { legalDocs } from "@/content/legal";

const doc = legalDocs.cambios;

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: `/${doc.slug}` },
};

export default function Page() {
  return <ContentPage doc={doc} />;
}
