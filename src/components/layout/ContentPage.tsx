import Link from "next/link";

import type { LegalDoc } from "@/content/legal";
import { legalNavLinks } from "@/content/legal";

type ContentPageProps = {
  doc: LegalDoc;
};

export function ContentPage({ doc }: ContentPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-normal text-zinc-950 sm:text-4xl">
        {doc.title}
      </h1>
      {doc.intro ? (
        <p className="mt-4 text-base leading-7 text-zinc-600">{doc.intro}</p>
      ) : null}

      <div className="mt-8 grid gap-8">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-black text-zinc-950">
              {section.heading}
            </h2>
            <div className="mt-3 grid gap-3">
              {section.body.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-7 text-zinc-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <nav className="mt-12 border-t border-zinc-200 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Mas informacion
        </p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {legalNavLinks
            .filter((link) => link.href !== `/${doc.slug}`)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-semibold text-zinc-700 underline hover:text-zinc-950"
              >
                {link.label}
              </Link>
            ))}
        </div>
      </nav>
    </div>
  );
}
