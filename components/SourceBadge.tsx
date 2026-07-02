type SourceLike = {
  source_page: number | string | null;
  source_pdf_page?: number | string | null;
  source_epd_page?: number | string | null;
  source_pdf: string | null;
  source_table: string | null;
};

export function SourceBadge({ module }: { module: SourceLike }) {
  const label = sourceLabel(module);

  if (!label) {
    return <span className="font-mono text-[11px] text-[#817765]">source n/a</span>;
  }

  return (
    <span
      className="font-mono text-[11px] font-semibold tabular-nums text-[#526042]"
      title={`${module.source_pdf} | ${module.source_table ?? "No source table"}`}
    >
      {label}
    </span>
  );
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
