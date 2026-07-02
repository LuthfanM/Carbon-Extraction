import Link from "next/link";
import { notFound } from "next/navigation";
import { CarbonBreakdownTable } from "@/components/CarbonBreakdownTable";
import { fetchProductFromBackend } from "@/lib/backend-api";
import { normalizeManufacturingLocation } from "@/lib/compare";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductFromBackend(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-[100dvh] text-stone-900">
      <nav className="border-b border-[#23291f] bg-[#182018] px-4 py-4 text-[#f4f0e7] md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-[#d8d1c1] underline-offset-4 hover:underline">
            Back to comparison
          </Link>
          <span className="font-mono text-xs text-[#b8c4a4]">{product.epd.registration_number}</span>
        </div>
      </nav>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
        <header className="grid gap-6 border border-[#1f271d] bg-[#263225] p-5 text-[#f4f0e7] shadow-[8px_8px_0_#d8c9aa] md:grid-cols-[1fr_340px] md:p-7">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#b8c4a4]">Product detail</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1] tracking-[-0.02em] md:text-6xl">{product.product.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#d8d1c1]">
              Lifecycle carbon values are shown with source page references. Missing stages are not counted as zero.
            </p>
          </div>
          <dl className="border border-[#6f7a5f] bg-[#1d261d] p-4 text-sm">
            <div className="grid grid-cols-2 gap-1 border-b border-[#6f7a5f] py-2">
              <dt className="text-[#b8c4a4]">Manufacturer</dt>
              <dd className="text-[#f4f0e7]">{product.product.manufacturer}</dd>
            </div>
            <div className="grid grid-cols-2 gap-1 border-b border-[#6f7a5f] py-2">
              <dt className="text-[#b8c4a4]">Location</dt>
              <dd className="text-[#f4f0e7]">{normalizeManufacturingLocation(product.product.manufacturing_location)}</dd>
            </div>
            <div className="grid grid-cols-2 gap-1 border-b border-[#6f7a5f] py-2">
              <dt className="text-[#b8c4a4]">Strength</dt>
              <dd className="font-mono text-[#f4f0e7]">{product.product.compressive_strength_mpa ?? "Unknown"} MPa</dd>
            </div>
            <div className="grid grid-cols-2 gap-1 py-2">
              <dt className="text-[#b8c4a4]">Declared unit</dt>
              <dd className="text-[#f4f0e7]">{product.product.declared_unit}</dd>
            </div>
          </dl>
        </header>

        <CarbonBreakdownTable product={product} />

        <section className="border border-[#1f271d] bg-[#d8c9aa] p-4 text-sm leading-6 text-[#31382e]">
          <h2 className="font-semibold text-[#172016]">Comparison limitations</h2>
          <p className="mt-2">
            Check declared unit, method, system boundary, and missing stages before comparing this product with another EPD. A missing stage means unknown or outside scope, not zero.
          </p>
        </section>
      </div>
    </main>
  );
}
