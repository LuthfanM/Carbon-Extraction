type SourceLike = {
  source_page: number | string | null;
  source_pdf: string | null;
  source_table: string | null;
};

export function SourceBadge({ module }: { module: SourceLike }) {
  if (!module.source_page) {
    return <span className="font-mono text-[11px] text-[#817765]">source n/a</span>;
  }

  return (
    <span
      className="font-mono text-[11px] font-semibold text-[#526042]"
      title={`${module.source_pdf} | ${module.source_table ?? "No source table"}`}
    >
      p.{module.source_page}
    </span>
  );
}
