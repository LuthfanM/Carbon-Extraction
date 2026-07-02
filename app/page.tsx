import { ComparisonNote } from "@/components/ComparisonNote";
import { ProductExplorer } from "@/components/ProductExplorer";
import { getProducts } from "@/lib/data";

export default async function Home() {
  const products = await getProducts();
  const productsWithA1A3 = products.filter((product) => product.carbon.modules["A1-A3"].status === "declared").length;
  const sourcePdfCount = new Set(products.map((product) => product.source_pdf)).size;

  return (
    <main className="min-h-[100dvh] text-stone-900">
      <nav className="border-b border-[#23291f] bg-[#182018] px-4 py-3 text-[#f4f0e7] md:px-6">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-[0.16em]">LOW CARBON MATERIALS HUB</span>
          <span className="hidden font-mono text-xs text-[#c8c0ae] sm:inline">{products.length} reviewed EPD records</span>
        </div>
      </nav>

      <header className="border-b border-[#23291f] bg-[#263225] text-[#f4f0e7]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-10 md:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] md:px-6 md:py-14">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-[#b8c4a4]">EPD COMPARISON VIEWER</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.02em] md:text-7xl">
              Concrete carbon data, shown with its weak spots.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d8d1c1]">
              Compare GWP-total by lifecycle stage, strength, location, and source page without treating missing data as zero.
            </p>
          </div>

          <aside className="grid content-between border-l border-[#6f7a5f] pl-5">
            <p className="max-w-sm text-sm leading-6 text-[#d8d1c1]">
              This is a traceable data tool. The table keeps product facts, lifecycle modules, and provenance visible in the same scan.
            </p>
            <dl className="mt-8 grid grid-cols-3 border-y border-[#6f7a5f] text-sm md:grid-cols-1">
              <div className="border-[#6f7a5f] py-4 md:border-b">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#b8c4a4]">Records</dt>
                <dd className="mt-1 text-3xl font-semibold">{products.length}</dd>
              </div>
              <div className="border-l border-[#6f7a5f] py-4 pl-4 md:border-b md:border-l-0 md:pl-0">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#b8c4a4]">A1-A3 declared</dt>
                <dd className="mt-1 text-3xl font-semibold">{productsWithA1A3}</dd>
              </div>
              <div className="border-l border-[#6f7a5f] py-4 pl-4 md:border-l-0 md:pl-0">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#b8c4a4]">Source PDFs</dt>
                <dd className="mt-1 text-3xl font-semibold">{sourcePdfCount}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1500px] border-b border-[#c8bfac] bg-[#eee9de] px-4 py-5 md:grid-cols-[1fr_320px] md:px-6">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.01em] text-[#1f271d]">
            Compare concrete EPDs by lifecycle carbon impact.
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6258]">
            Start with products at similar strength and location, then inspect which lifecycle stages are missing before comparing totals.
          </p>
        </div>
        <div className="mt-4 border-t border-[#c8bfac] pt-4 md:mt-0 md:border-l md:border-t-0 md:pl-5 md:pt-0">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#526042]">Critical rule</p>
          <p className="mt-2 text-sm font-semibold text-[#1f271d]">
            Missing lifecycle stages are not counted as zero.
          </p>
        </div>
      </section>

      <ComparisonNote />
      <ProductExplorer products={products} />
    </main>
  );
}
