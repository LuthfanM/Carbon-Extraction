export function ComparisonNote() {
  return (
    <section className="border-b border-[#2a3026] bg-[#d8c9aa] px-4 py-4 text-sm text-[#1f271d] md:px-6">
      <div className="mx-auto grid max-w-[1500px] gap-3 md:grid-cols-[220px_1fr]">
        <div className="font-mono text-xs uppercase tracking-[0.16em]">Comparison note</div>
        <p className="max-w-5xl leading-6">
          Products are compared using GWP-total per declared unit. Missing lifecycle stages are shown as Not declared or Not extracted and are not counted as zero. Products with different declared units, methods, or system boundaries may not be directly comparable.
        </p>
      </div>
    </section>
  );
}
