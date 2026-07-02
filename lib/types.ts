export const LIFE_CYCLE_MODULES = [
  "A1",
  "A2",
  "A3",
  "A1-A3",
  "A4",
  "A5",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "C1",
  "C2",
  "C3",
  "C4",
  "D",
] as const;

export type LifeCycleModule = (typeof LIFE_CYCLE_MODULES)[number];

export type CarbonValueStatus =
  | "declared"
  | "not_declared"
  | "not_extracted"
  | "needs_review";

export type CarbonModuleValue = {
  value: number | null;
  status: CarbonValueStatus;
  source_pdf: string;
  source_page: number | string | null;
  source_table: string | null;
  note?: string;
};

export type ProductEpd = {
  schema_version: "1.0";
  source_pdf: string;
  epd: {
    registration_number: string;
    published_date: string | null;
    valid_until: string | null;
  };
  product: {
    name: string;
    manufacturer: string;
    concrete_type: string | null;
    manufacturing_location: string | string[] | null;
    compressive_strength_mpa: number | null;
    compressive_strength: {
      value: number | null;
      unit: "MPa";
      source_page: number | string | null;
    };
    declared_unit: string;
    mass_kg_per_declared_unit: number | null;
    declared_unit_details: {
      value: string;
      mass_kg: number | null;
      source_page: number | string | null;
    };
  };
  carbon: {
    indicator: "GWP-total";
    unit: "kg CO2e per declared unit";
    method: string | null;
    system_boundary: string | null;
    modules: Record<LifeCycleModule, CarbonModuleValue>;
    lifecycle_total_declared: number | null;
  };
  provenance: Array<{
    page: number | string;
    indicator: string;
    source_text: string;
  }>;
  extraction_notes: string;
};
