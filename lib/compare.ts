import type { CarbonModuleValue, LifeCycleModule, ProductEpd } from "@/lib/types";

export const DISPLAY_STAGES = ["A1-A3", "A4", "A5", "B1-B7", "C1-C4", "D"] as const;

export type DisplayStage = (typeof DISPLAY_STAGES)[number];

export type DisplayStageValue = {
  value: number | null;
  status: CarbonModuleValue["status"] | "partially_declared";
  source_page: number | string | null;
  source_pdf_page?: number | string | null;
  source_epd_page?: number | string | null;
  source_pdf: string | null;
  source_table: string | null;
  missingStages: string[];
};

const B_STAGES: LifeCycleModule[] = ["B1", "B2", "B3", "B4", "B5", "B6", "B7"];
const C_STAGES: LifeCycleModule[] = ["C1", "C2", "C3", "C4"];

export function getA1A3Value(product: ProductEpd) {
  return product.carbon.modules["A1-A3"].value;
}

export function normalizeManufacturingLocation(
  location: ProductEpd["product"]["manufacturing_location"],
) {
  if (Array.isArray(location)) {
    return location.join(", ");
  }
  return location ?? "Unknown";
}

export function getSourceLabel(module: Pick<CarbonModuleValue, "source_page">) {
  return module.source_page ? `p.${module.source_page}` : "No source page";
}

export function mapStatusToLabel(status: DisplayStageValue["status"]) {
  const labels: Record<DisplayStageValue["status"], string> = {
    declared: "Declared",
    not_declared: "Not declared",
    not_extracted: "Not extracted",
    needs_review: "Needs review",
    partially_declared: "Partially declared",
  };

  return labels[status];
}

export function stageValue(product: ProductEpd, stage: DisplayStage): DisplayStageValue {
  if (stage === "B1-B7") {
    return groupedStage(product, B_STAGES);
  }
  if (stage === "C1-C4") {
    return groupedStage(product, C_STAGES);
  }

  const module = product.carbon.modules[stage];
  return {
    value: module.value,
    status: module.status,
    source_page: module.source_page,
    source_pdf_page: module.source_pdf_page,
    source_epd_page: module.source_epd_page,
    source_pdf: module.source_pdf,
    source_table: module.source_table,
    missingStages: module.status === "declared" ? [] : [stage],
  };
}

export function missingStageCount(product: ProductEpd) {
  return Object.values(product.carbon.modules).filter((module) => module.status !== "declared").length;
}

function groupedStage(product: ProductEpd, stages: LifeCycleModule[]): DisplayStageValue {
  const modules = stages.map((stage) => [stage, product.carbon.modules[stage]] as const);
  const declared = modules.filter(([, module]) => module.status === "declared");
  const notExtracted = modules.find(([, module]) => module.status === "not_extracted" || module.status === "needs_review");
  const missingStages = modules
    .filter(([, module]) => module.status !== "declared")
    .map(([stage]) => stage);

  if (notExtracted) {
    return {
      value: null,
      status: "needs_review",
      source_page: null,
      source_pdf_page: null,
      source_epd_page: null,
      source_pdf: null,
      source_table: null,
      missingStages,
    };
  }

  if (declared.length === 0) {
    const first = modules[0]?.[1];
    return {
      value: null,
      status: "not_declared",
      source_page: first?.source_page ?? null,
      source_pdf_page: first?.source_pdf_page ?? first?.source_page ?? null,
      source_epd_page: first?.source_epd_page ?? first?.source_page ?? null,
      source_pdf: first?.source_pdf ?? null,
      source_table: first?.source_table ?? null,
      missingStages,
    };
  }

  if (declared.length !== modules.length) {
    return {
      value: declared.reduce((total, [, module]) => total + (module.value ?? 0), 0),
      status: "partially_declared",
      source_page: null,
      source_pdf_page: null,
      source_epd_page: null,
      source_pdf: null,
      source_table: null,
      missingStages,
    };
  }

  const first = declared[0]?.[1];
  return {
    value: declared.reduce((total, [, module]) => total + (module.value ?? 0), 0),
    status: "declared",
    source_page: first?.source_page ?? null,
    source_pdf_page: first?.source_pdf_page ?? first?.source_page ?? null,
    source_epd_page: first?.source_epd_page ?? first?.source_page ?? null,
    source_pdf: first?.source_pdf ?? null,
    source_table: first?.source_table ?? null,
    missingStages: [],
  };
}
