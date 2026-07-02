import { getComparisonLimitations } from "@/lib/compare";
import type { ProductRecord } from "@/lib/types";

export function ComparisonLimitations({ products }: { products: ProductRecord[] }) {
  const limitations = getComparisonLimitations(products);

  if (products.length === 0) {
    return null;
  }

  if (limitations.length === 0) {
    return (
      <section className="border border-[#687158] bg-[#eef3df] px-4 py-3 text-sm text-[#263225]">
        <div className="grid gap-2 md:grid-cols-[220px_1fr]">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em]">Comparison check</h2>
          <p className="leading-6">No obvious comparison limitation detected for the currently visible products.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-[#8f6b2f] bg-[#fff8e8] px-4 py-4 text-sm text-[#31382e]">
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-[#5c3513]">Comparison warning</h2>
          <p className="mt-2 text-xs leading-5 text-[#665d4d]">{products.length} visible products checked</p>
        </div>
        <ul className="grid gap-2 md:grid-cols-2">
          {limitations.map((limitation) => (
            <li key={limitation.kind} className="border-l border-[#a46c2a] pl-3">
              <div className="font-semibold text-[#172016]">{limitation.label}</div>
              <p className="mt-1 leading-6 text-[#5f6258]">{limitation.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
