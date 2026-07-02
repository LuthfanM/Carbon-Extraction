"use client";

export type ProductSortMode = "a1a3_asc" | "a1a3_desc" | "strength" | "name";

type ProductFiltersProps = {
  query: string;
  strength: string;
  location: string;
  sortMode: ProductSortMode;
  strengths: number[];
  locations: string[];
  onQueryChange: (value: string) => void;
  onStrengthChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSortModeChange: (value: ProductSortMode) => void;
};

export function ProductFilters({
  query,
  strength,
  location,
  sortMode,
  strengths,
  locations,
  onQueryChange,
  onStrengthChange,
  onLocationChange,
  onSortModeChange,
}: ProductFiltersProps) {
  return (
    <div className="grid gap-3 border border-[#1f271d] bg-[#eee4d2] p-3 shadow-[8px_8px_0_#263225] md:grid-cols-[1fr_180px_240px_190px]">
      <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#394234]">
        Search
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="h-11 border border-[#968a73] bg-[#fffdf7] px-3 text-sm font-medium normal-case tracking-normal text-[#1f271d] outline-none transition focus:border-[#1f271d] focus:bg-white"
          placeholder="Product or manufacturer"
        />
      </label>
      <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#394234]">
        Strength
        <select
          value={strength}
          onChange={(event) => onStrengthChange(event.target.value)}
          className="h-11 border border-[#968a73] bg-[#fffdf7] px-3 text-sm font-medium normal-case tracking-normal text-[#1f271d] outline-none transition focus:border-[#1f271d] focus:bg-white"
        >
          <option value="all">All strengths</option>
          {strengths.map((value) => (
            <option key={value} value={value}>
              {value} MPa
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#394234]">
        Manufacturing location
        <select
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
          className="h-11 border border-[#968a73] bg-[#fffdf7] px-3 text-sm font-medium normal-case tracking-normal text-[#1f271d] outline-none transition focus:border-[#1f271d] focus:bg-white"
        >
          <option value="all">All locations</option>
          {locations.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#394234]">
        Sort
        <select
          value={sortMode}
          onChange={(event) => onSortModeChange(event.target.value as ProductSortMode)}
          className="h-11 border border-[#968a73] bg-[#fffdf7] px-3 text-sm font-medium normal-case tracking-normal text-[#1f271d] outline-none transition focus:border-[#1f271d] focus:bg-white"
        >
          <option value="a1a3_asc">Lowest A1-A3</option>
          <option value="a1a3_desc">Highest A1-A3</option>
          <option value="strength">Strength</option>
          <option value="name">Product name</option>
        </select>
      </label>
    </div>
  );
}
