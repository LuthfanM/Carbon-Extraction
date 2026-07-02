from __future__ import annotations

import json
import re
from pathlib import Path


DATA_DIR = Path("data")
TEXT_DIR = Path("tmp/extracted")
MODULES = ["A1", "A2", "A3", "A1-A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "C1", "C2", "C3", "C4", "D"]
SYSTEM_BOUNDARY = "As declared in the EPD GWP-total lifecycle module table"
METHOD = "GWP-total as declared in the source EPD"


def number(value: str) -> float | None:
    value = value.replace(",", ".").replace("‐", "-").replace("–", "-")
    if value == "ND":
        return None
    return float(value)


def row_values(row: str) -> list[float | None]:
    row = row.replace("kg CO2e", "kg COe").replace("kg CO₂e", "kg COe")
    payload = row.split("kg COe", 1)[1]
    return [number(v) for v in re.findall(r"(?:ND|[-‐]?\d+[,.]?\d*E[+‐-]\d+|[-‐]?\d+[,.]?\d*)", payload)]


def page_for(lines: list[str], line_index: int) -> int | None:
    for index in range(line_index, -1, -1):
        match = re.match(r"===== PAGE (\d+) =====", lines[index])
        if match:
            return int(match.group(1))
    return None


def first_page_containing(lines: list[str], text: str) -> int | None:
    for index, line in enumerate(lines):
        if text in line:
            return page_for(lines, index)
    return None


def stage_map(
    *,
    values: dict[str, float | None],
    source_pdf: str,
    source_page: int | str | None,
    source_table: str | None,
    missing_status: str = "not_declared",
    module_sources: dict[str, dict[str, int | str | None]] | None = None,
) -> dict[str, dict[str, object]]:
    modules: dict[str, dict[str, object]] = {}
    for stage in MODULES:
        source = (module_sources or {}).get(stage, {})
        stage_source_page = source.get("source_page", source_page)
        stage_source_table = source.get("source_table", source_table)
        value = values.get(stage)
        if stage in values and value is not None:
            status = "declared"
            note = None
        elif stage in values:
            status = "not_declared"
            note = "Module is marked ND/not declared in the source table."
        else:
            status = missing_status
            note = (
                "Module was not reported for this product in the extracted source table."
                if missing_status == "not_declared"
                else "Module value was not captured during extraction and needs manual review."
            )
        modules[stage] = {
            "value": value if stage in values else None,
            "status": status,
            "source_pdf": Path(source_pdf).name,
            "source_page": stage_source_page if status != "not_extracted" else None,
            "source_table": stage_source_table if status != "not_extracted" else None,
        }
        if note:
            modules[stage]["note"] = note
    return modules


def entry(
    *,
    slug: str,
    source_pdf: str,
    epd_number: str,
    product_name: str,
    manufacturer: str,
    location: str | list[str] | None,
    strength_mpa: float | None,
    declared_unit: str,
    mass_kg_per_declared_unit: float | None,
    values: dict[str, float | None],
    provenance: list[dict[str, object]],
    notes: str = "",
    lifecycle_total_declared: float | None = None,
    concrete_type: str | None = "Ready-mix concrete",
    published_date: str | None = None,
    valid_until: str | None = None,
    product_source_page: int | str | None = None,
    declared_unit_source_page: int | str | None = None,
    carbon_source_page: int | str | None = None,
    carbon_source_table: str | None = "GWP-total lifecycle module table",
    module_sources: dict[str, dict[str, int | str | None]] | None = None,
    system_boundary: str | None = SYSTEM_BOUNDARY,
    method: str | None = METHOD,
    missing_status: str = "not_declared",
) -> tuple[str, dict[str, object]]:
    return slug, {
        "schema_version": "1.0",
        "source_pdf": source_pdf,
        "epd": {
            "registration_number": epd_number,
            "published_date": published_date,
            "valid_until": valid_until,
        },
        "product": {
            "name": product_name,
            "manufacturer": manufacturer,
            "concrete_type": concrete_type,
            "manufacturing_location": location,
            "compressive_strength_mpa": strength_mpa,
            "compressive_strength": {
                "value": strength_mpa,
                "unit": "MPa",
                "source_page": product_source_page,
            },
            "declared_unit": declared_unit,
            "mass_kg_per_declared_unit": mass_kg_per_declared_unit,
            "declared_unit_details": {
                "value": declared_unit,
                "mass_kg": mass_kg_per_declared_unit,
                "source_page": declared_unit_source_page,
            },
        },
        "carbon": {
            "indicator": "GWP-total",
            "unit": "kg CO2e per declared unit",
            "method": method,
            "system_boundary": system_boundary,
            "modules": stage_map(
                values=values,
                source_pdf=source_pdf,
                source_page=carbon_source_page,
                source_table=carbon_source_table,
                missing_status=missing_status,
                module_sources=module_sources,
            ),
            "lifecycle_total_declared": lifecycle_total_declared,
        },
        "provenance": provenance,
        "extraction_notes": notes,
    }


def epd_hub_entries() -> list[tuple[str, dict[str, object]]]:
    specs = {
        "EPD_HUB-5210_2026-06-27_en": ("epd-hub-5210", "EPD_HUB-5210", "Boral", "Australia", 32),
        "EPD_HUB-5394_2026-06-27_en": ("epd-hub-5394", "EPD_HUB-5394", "Tandy Concrete", "Mackay, Queensland", 32),
        "EPD_HUB-5480_2026-06-27_en": ("epd-hub-5480", "EPD_HUB-5480", "Tandy Concrete", "Mackay, Queensland", 40),
        "EPD_HUB-5527_2026-06-27_en": ("epd-hub-5527", "EPD_HUB-5527", "Tandy Concrete", "Airlie Beach, Queensland", 40),
        "EPD_HUB-5555_2026-06-27_en": ("epd-hub-5555", "EPD_HUB-5555", "Boral", "Australia", 40),
        "EPD_HUB-5556_2026-06-27_en": ("epd-hub-5556", "EPD_HUB-5556", "Boral", "Australia", 50),
        "EPD_HUB-5749_2026-06-27_en": ("epd-hub-5749", "EPD_HUB-5749", "Entire Concrete", "Cameron Park, New South Wales", 25),
        "EPD_HUB-5882_2026-06-27_en": ("epd-hub-5882", "EPD_HUB-5882", "Boral", "Australia", 40),
        "EPD_HUB-5943_2026-06-27_en": ("epd-hub-5943", "EPD_HUB-5943", "Entire Concrete", "Cameron Park, New South Wales", 50),
        "EPD_HUB-5991_2026-06-27_en": ("epd-hub-5991", "EPD_HUB-5991", "Entire Concrete", "VWA Plant, New South Wales", 40),
    }
    out: list[tuple[str, dict[str, object]]] = []
    for stem, (slug, epd_no, manufacturer, location, strength) in specs.items():
        text = (TEXT_DIR / f"{stem}.txt").read_text(encoding="utf-8")
        lines = text.splitlines()
        name = re.search(r"Product name\s+(.+)", text).group(1).strip()
        mass = number(re.search(r"Declared unit mass, kg\s+([\d.,]+)", text).group(1))
        row_hits = [(index, line.strip()) for index, line in enumerate(lines) if "GWP – total" in line]
        rows = [row for _, row in row_hits]
        product_page = first_page_containing(lines, "Product name")
        declared_unit_page = first_page_containing(lines, "Declared unit")
        carbon_page = first_page_containing(lines, "GWP – total")
        values: dict[str, float | None] = {}
        if len(rows) == 1:
            parsed = row_values(rows[0])
            for module, value in zip(["A1", "A2", "A3", "A1-A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "C1", "C2", "C3", "C4", "D"], parsed):
                values[module] = value
            module_sources = {
                module: {"source_page": page_for(lines, row_hits[0][0]), "source_table": "Environmental impacts - GWP-total"}
                for module in values
            }
        else:
            first = row_values(rows[0])
            second = row_values(rows[1])
            for module, value in zip(["A1", "A2", "A3", "A1-A3"], first):
                values[module] = value
            for module, value in zip(["C1", "C2", "C3", "C4", "D"], second):
                values[module] = value
            module_sources = {
                module: {"source_page": page_for(lines, row_hits[0][0]), "source_table": "Environmental impacts - GWP-total"}
                for module in ["A1", "A2", "A3", "A1-A3"]
            }
            module_sources.update({
                module: {"source_page": page_for(lines, row_hits[1][0]), "source_table": "Environmental impacts - GWP-total"}
                for module in ["C1", "C2", "C3", "C4", "D"]
            })
        out.append(entry(
            slug=slug,
            source_pdf=f"public/epd/{stem}.pdf",
            epd_number=epd_no,
            product_name=name,
            manufacturer=manufacturer,
            location=location,
            strength_mpa=strength,
            declared_unit="1 cubic metre",
            mass_kg_per_declared_unit=mass,
            values=values,
            provenance=[{"page": "summary and environmental impacts table", "indicator": "GWP-total", "source_text": "GWP-total / GWP - total rows"}],
            notes="Parsed from EPD Hub summary and GWP-total environmental impact rows.",
            lifecycle_total_declared=values.get("A1-A3"),
            product_source_page=product_page,
            declared_unit_source_page=declared_unit_page,
            carbon_source_page=carbon_page,
            carbon_source_table="Environmental impacts - GWP-total",
            module_sources=module_sources,
        ))
    return out


MANUAL = [
    entry(slug="hanson-p252080", source_pdf="public/epd/EPD-IES-0014769_P252080.pdf", epd_number="EPD-IES-0014769:001", product_name="P252080", manufacturer="Hanson", location="Brisbane, Queensland", strength_mpa=25, declared_unit="1 m3", mass_kg_per_declared_unit=2480, values={"A1-A3": 127, "A4": 2.45, "A5": 9.95, "B1": -2.65, "B2": 0, "B3": 0, "B4": 0, "B5": 0, "B6": 0, "B7": 0, "C1": 8.99, "C2": 8.85, "C3": 5.24, "C4": 2.79, "D": 6.14}, provenance=[{"page": 20, "indicator": "metadata", "source_text": "Product Identification P252080"}, {"page": 21, "indicator": "GWP-total", "source_text": "Core Environmental Impact Indicators / GWP-tot row"}], notes="Stage values verified from rendered page because text extraction split the table into fragments.", product_source_page=20, declared_unit_source_page=20, carbon_source_page=21, carbon_source_table="Core Environmental Impact Indicators / GWP-tot row"),
    entry(slug="heidelberg-ge322lpf2", source_pdf="public/epd/EPD-IES-0014785_Heidelberg_Woolworths-GE322LPF2.pdf", epd_number="EPD-IES-0014785:001", product_name="GE322LPF2", manufacturer="Heidelberg Materials", location="Brisbane, Queensland", strength_mpa=32, declared_unit="1 m3", mass_kg_per_declared_unit=2355.5, values={"A1-A3": 145, "A4": 3.41, "A5": 10.1, "B1": -3.17, "B2": 0, "B3": 0, "B4": 0, "B5": 0, "B6": 0, "B7": 0, "C1": 8.99, "C2": 9.03, "C3": 5.19, "C4": 2.85, "D": -14.1}, provenance=[{"page": 17, "indicator": "metadata", "source_text": "Product identification GE322LPF2"}, {"page": 18, "indicator": "GWP-total", "source_text": "Core environmental impact indicators / GWP-tot row"}], notes="Stage values verified from rendered page because text extraction split the table into fragments.", lifecycle_total_declared=167, product_source_page=17, declared_unit_source_page=17, carbon_source_page=18, carbon_source_table="Core environmental impact indicators / GWP-tot row"),
    entry(slug="hymix-hylo50-normal-25mpa", source_pdf="public/epd/EPD-IES-0014958_Hymix_GE252WA06-3_2024-11-19.pdf", epd_number="EPD-IES-0014958:001", product_name="HyLo-50 Normal-Class 25 MPa", manufacturer="Hymix", location="Queensland - Gold Coast", strength_mpa=25, declared_unit="1 m3", mass_kg_per_declared_unit=None, values={"A1-A3": 141}, provenance=[{"page": 22, "indicator": "GWP-total", "source_text": "HyLo-50 Normal-Class 25 MPa row: A1-A3 141, Full Lifecycle 167"}, {"page": 26, "indicator": "geography", "source_text": "GEOGRAPHICAL SCOPE QUEENSLAND - GOLD COAST"}], notes="Only the summary A1-A3 and full lifecycle values were extracted; the module split was not legible in the text layer.", lifecycle_total_declared=167, product_source_page=22, declared_unit_source_page=6, carbon_source_page=22, carbon_source_table="Product Environmental Performance summary table", missing_status="not_extracted"),
    entry(slug="holcim-qx25mor", source_pdf="public/epd/epd-australasia-com-wp-content-uploads-2024-12-epd-ies-0014327-002-holcim-qld-seq-geostone-qx25mor-2026-04-02-pdf.pdf", epd_number="EPD-IES-0014327:002", product_name="QX25MOR - S25 MORETON GEOSTONE", manufacturer="Holcim", location="Queensland - SEQ", strength_mpa=25, declared_unit="1 m3", mass_kg_per_declared_unit=2361, values={"A1-A3": 237, "A4": 2.63, "A5": 15.6, "C1": 0.522, "C2": 4.39, "C3": 10.5, "C4": 0, "D": -18.8}, provenance=[{"page": 10, "indicator": "metadata", "source_text": "25 QX25MOR 2361 Decorative"}, {"page": 16, "indicator": "GWP-total", "source_text": "GWP-Total kg CO2 eq. 237 2.63 15.6 0.522 4.39 10.5 0 -18.8"}], product_source_page=10, declared_unit_source_page=16, carbon_source_page=16, carbon_source_table="Primary environmental indicators - GWP-Total"),
    entry(slug="holcim-qe252m100", source_pdf="public/epd/epd-australasia-com-wp-content-uploads-2025-05-epd-ies-0029695-001-holcim-qld-brisbane-ecopact-qe252m100-2026-04-15-1-pdf.pdf", epd_number="EPD-IES-0029695:001", product_name="QE252M100 - S25/20/100 ECOPact Concrete", manufacturer="Holcim", location="Queensland - Brisbane", strength_mpa=25, declared_unit="1 m3", mass_kg_per_declared_unit=2319, values={"A1-A3": 146, "A4": 2.58, "A5": 12.9, "C1": 0.522, "C2": 4.31, "C3": 10.4, "C4": 0, "D": -18.5}, provenance=[{"page": 10, "indicator": "metadata", "source_text": "25 QE252M100 2319 General use"}, {"page": 16, "indicator": "GWP-total", "source_text": "GWP-Total kg CO2 eq. 146 2.58 12.9 0.522 4.31 10.4 0 -18.5"}], product_source_page=10, declared_unit_source_page=16, carbon_source_page=16, carbon_source_table="Primary environmental indicators - GWP-Total"),
    entry(slug="adbri-sn252f100", source_pdf="public/epd/epd-ies-0021165-sn252f100.pdf", epd_number="EPD-IES-0021165", product_name="SN252F100 Futurecrete Normal Class GL-Slag 25 MPa", manufacturer="Adbri Concrete", location="South Australia", strength_mpa=25, declared_unit="1 m3", mass_kg_per_declared_unit=None, values={"A1-A3": 143.83, "A4": 9.64}, provenance=[{"page": 32, "indicator": "GWP-total", "source_text": "Table 8: SN252F100 GWPt 143.83"}, {"page": 34, "indicator": "A4 GWP-total", "source_text": "Table 13: Concrete produced at South Australia GWP-total 9.64"}], notes="Adbri declares A1-A3 for the mix and A4 as an average South Australia distribution scenario; other modules were not extracted as product-specific values.", product_source_page=32, declared_unit_source_page=18, carbon_source_page=32, carbon_source_table="Table 8: Product stage GWPt row", module_sources={"A1-A3": {"source_page": 32, "source_table": "Table 8: Product stage GWPt row"}, "A4": {"source_page": 34, "source_table": "Table 13: Distribution stage GWP-total row"}}, missing_status="not_extracted"),
    entry(slug="aurora-ar2520", source_pdf="public/epd/epd-ies-0021754-001-acm-rockbank-ar2520.pdf", epd_number="EPD-IES-0021754:001", product_name="AR2520 pre-mixed concrete", manufacturer="Aurora Construction Materials", location="Rockbank, Melbourne, Victoria", strength_mpa=25, declared_unit="1 m3", mass_kg_per_declared_unit=2270, values={"A1-A3": 140, "C1": 12, "C2": 14.5, "C3": 8.03, "C4": 0.861, "D": -9.79}, provenance=[{"page": 5, "indicator": "metadata", "source_text": "AR2520 25MPa 2 270 kg/m3"}, {"page": 18, "indicator": "GWP-total", "source_text": "Table 10: GWP-total 1.40E+02 1.20E+01 1.45E+01 8.03E+00 8.61E-01 -9.79E+00"}], product_source_page=5, declared_unit_source_page=5, carbon_source_page=18, carbon_source_table="Table 10: Environmental indicators EN 15804+A2"),
    entry(slug="greencrete-s32mpa-70", source_pdf="public/epd/epd-ies-0023043-s32mpa-greencrete-70.pdf", epd_number="EPD-IES-0023043", product_name="Premix Concrete - S32MPa GreenCrete 70", manufacturer="Premix Concrete", location="Port Melbourne, Victoria", strength_mpa=32, declared_unit="1 m3", mass_kg_per_declared_unit=2373, values={"A1-A3": 134, "C1": 5.67, "C2": 21.6, "C3": 12.5, "C4": 2.29, "D": -1.61}, provenance=[{"page": 3, "indicator": "metadata", "source_text": "Production Site: 262 Salmon Street Port Melbourne VIC 3207"}, {"page": 8, "indicator": "GWP-total", "source_text": "GWP - total kg CO2 eq 1.34E+02 5.67E+00 2.16E+01 1.25E+01 2.29E+00 -1.61E+00"}], product_source_page=3, declared_unit_source_page=5, carbon_source_page=8, carbon_source_table="Environmental impacts - GWP-total"),
    entry(slug="holcim-ve322eamf", source_pdf="public/epd/epd-ies-20602-001-holcim-vic-melbourne-metro-ecopact-ve322eamf-epd.pdf", epd_number="EPD-IES-20602:001", product_name="VE322EAMF ECOPact", manufacturer="Holcim", location="Melbourne Metro, Victoria", strength_mpa=32, declared_unit="1 m3", mass_kg_per_declared_unit=None, values={"A1-A3": 105, "A4": 2.05, "A5": 8.81, "C1": 0.532, "C2": 3.99, "C3": 7.61, "C4": 1.28, "D": -15.7}, provenance=[{"page": 10, "indicator": "metadata", "source_text": "32.0 VE322EAMF General"}, {"page": 15, "indicator": "GWP-total", "source_text": "GWP-Total kg CO2 eq. 105 2.05 8.81 0.532 3.99 7.61 1.28 -15.7"}], product_source_page=10, declared_unit_source_page=15, carbon_source_page=15, carbon_source_table="Primary environmental indicators - GWP-Total"),
    entry(slug="epd-ies-0009353-hallett-ready-mix-concrete", source_pdf="public/epd/epd-australasia-com-wp-content-uploads-2023-08-epd-ies-0009353-003-hallett-ready-mix-concrete-2026-05-04-pdf.pdf", epd_number="EPD-IES-0009353:003", product_name="Hallett Ready Mix concrete", manufacturer="Hallett Group", location=["Dry Creek", "Elizabeth", "Mile End", "McLaren Vale", "Osborne"], strength_mpa=32, declared_unit="1 m3", mass_kg_per_declared_unit=2332, values={"C1": 14.8, "C2": 5.96, "C3": 5.02, "C4": 8.45, "D": -11.6}, provenance=[{"page": 5, "indicator": "product scope", "source_text": "This EPD covers our Ready Mix concrete products"}, {"page": 68, "indicator": "GWP-total", "source_text": "MIX NAME N3220P S50 - representative for average density; GWPt kg CO-eq 14.8 5.96 5.02 8.45 -11.6"}], notes="This EPD covers many mixes and plants. The extracted C1-C4 and D values come from the EPD row labelled N3220P S50 - representative for average density. A1-A3 varies by plant and mix and was not reduced to a single product value.", product_source_page=5, declared_unit_source_page=11, carbon_source_page=68, carbon_source_table="Representative modules C1-C4 and D GWPt row", missing_status="not_extracted"),
]


def main() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    all_entries = epd_hub_entries() + MANUAL
    for slug, data in all_entries:
        (DATA_DIR / f"{slug}.json").write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(all_entries)} JSON files")


if __name__ == "__main__":
    main()
