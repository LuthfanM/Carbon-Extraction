type SourceLike = {
  source_page: number | string | null;
  source_pdf_page?: number | string | null;
  source_epd_page?: number | string | null;
  source_pdf: string | null;
  source_table: string | null;
};

export function SourceBadge({ module }: { module: SourceLike }) {
  const label = sourceLabel(module);
  const href = sourcePdfHref(module);

  if (!href) {
    return <span className="font-mono text-[11px] text-[#817765]">source n/a</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-mono text-[11px] font-semibold tabular-nums text-[#526042] underline decoration-[#9aa784] underline-offset-2 hover:text-[#263225]"
      title={`${module.source_pdf} | ${module.source_table ?? "No source table"}`}
    >
      {label ?? "source n/a"}
    </a>
  );
}

export function sourcePdfHref(module: Pick<SourceLike, "source_pdf" | "source_pdf_page" | "source_page">) {
  if (!module.source_pdf) {
    return null;
  }

  const pdfFile = module.source_pdf.split("/").at(-1);

  if (!pdfFile) {
    return null;
  }

  const pdfPage = module.source_pdf_page ?? module.source_page;
  const pageFragment = pdfPage ? `#page=${encodeURIComponent(String(pdfPage))}` : "";

  return `/epd/${encodeURIComponent(pdfFile)}${pageFragment}`;
}

function sourceLabel(module: SourceLike) {
  const pdfPage = module.source_pdf_page ?? module.source_page;
  const epdPage = module.source_epd_page;

  if (epdPage && pdfPage && String(epdPage) !== String(pdfPage)) {
    return `EPD p.${epdPage} / PDF p.${pdfPage}`;
  }

  if (pdfPage) {
    return `PDF p.${pdfPage}`;
  }

  if (epdPage) {
    return `EPD p.${epdPage}`;
  }

  return null;
}
