# EXTRACTION.md

## Overall Strategy

The goal was to turn 20 concrete EPD PDFs into JSON files that the app can compare.

An EPD is basically a product carbon document. The most important number for this app is `GWP-total`, which means global warming impact. I extracted that number by lifecycle stage, because concrete carbon is not always reported as one simple total.

The stages are things like:

- `A1-A3`: making the concrete, including raw materials and manufacturing
- `A4`: transport to site
- `A5`: construction or installation
- `C1-C4`: end-of-life stages
- `D`: benefits or loads beyond the product system, such as recycling credits

I also extracted product information that helps make comparisons fair: product name, manufacturer, location, strength, declared unit, and EPD number.

## Data Schema

Each PDF has one JSON file in `data`.

Each JSON file has these main sections:

- `source_pdf`: which PDF the data came from
- `epd`: EPD registration and date fields
- `product`: product name, manufacturer, concrete type, location, strength, and declared unit
- `carbon`: carbon data by lifecycle stage
- `provenance`: general notes about where the data came from
- `extraction_notes`: extra warnings or context

Inside `carbon.modules`, each lifecycle stage has:

- `value`: the carbon number, or `null` if missing
- `status`: whether the value is declared, not declared, or not extracted
- `source_pdf`: the source PDF filename
- `source_page`: legacy page reference used by the first extraction pass
- `source_pdf_page`: the page number to use in the PDF viewer
- `source_epd_page`: the printed page number inside the EPD document, when it differs
- `source_table`: the table or row where the value was found

This structure is designed so the app can show both the carbon value and where it came from.

Some PDFs have two page numbering systems. For example, a table can be on printed EPD page 68 but appear on PDF viewer page 35. In that case the app should show both, such as `EPD p.68 / PDF p.35`.

## Extraction Process

I used a mix of automated PDF parsing and manual checking.

First, I used `scripts/extract_pdf_text.py` to read every PDF in `public/epd` and produce text files in `tmp/extracted`. This made it easier to search for product names, strengths, declared units, and GWP tables.

Then I used `scripts/build_extraction_json.py` to generate the final JSON files in `data`.

Secondly, after I used a Python-based PDF extraction script to produce draft JSON, then I used AI as a second checker to review the JSON against the source EPD. I did not use AI as the source of truth. The final decision comes from the PDF and provenance.

Some PDFs had clean tables, especially the EPD Hub documents. Those could be parsed more directly. Other PDFs had tables that did not convert cleanly to text, so I checked rendered page images manually and then encoded those values in the generator script.

## Accuracy and Validation

I checked the data in a few ways:

- confirmed there are 20 PDFs and 20 JSON files
- confirmed every JSON file is valid JSON
- checked that every lifecycle stage has the same structure
- checked that every carbon module has source fields
- spot-checked difficult rows against the PDF page or rendered image

One specific problem was that PDF text extraction can confuse footnotes or units with numbers. For example, `GWP-total1)` and `CO2e` can accidentally look like data. The parser was adjusted to only read the actual values after the unit label.

## Missing Data Handling

Missing data is not treated as zero.

This is important because if an EPD does not declare `A4`, that does not mean transport has zero carbon. It means the EPD did not provide that value.

The statuses are:

- `declared`: the EPD gives a value and it was extracted
- `not_declared`: the EPD does not declare that stage
- `not_extracted`: I could not confidently extract that stage
- `needs_review`: reserved for data that should be checked again

If a stage is missing or uncertain, the JSON uses:

```json
{
  "value": null
}
```

A value of `0` is only used when the EPD explicitly says the value is zero.

## Provenance

Every carbon number is linked back to its source.

For each lifecycle stage, the JSON includes:

- PDF filename
- page number
- table or row name

Example:

```txt
A1-A3: 275 kg CO2e
Source: EPD_HUB-5210_2026-06-27_en.pdf, page 13
Table: Environmental impacts - GWP-total
```

This matters because a builder should not make a procurement decision from a carbon number that cannot be checked.

## Limitations

Some PDFs were much easier to read than others. A few tables did not extract cleanly, so those values needed manual checking.

Some EPDs only provide `A1-A3` as a combined value, not separate `A1`, `A2`, and `A3` values. Some metadata, like exact publication date or valid-until date, is still missing for some products.

The Hallett EPD covers many mixes and plants, so I did not pretend it was one simple product. I kept it as representative data and marked uncertain stages carefully.

The Python scripts are also designed for this take-home dataset, not for very large-scale ingestion. `extract_pdf_text.py` keeps one PDF's extracted text in memory before writing it, and `build_extraction_json.py` reads extracted text files fully into memory. That is acceptable for these 20 EPDs, but for very large PDFs or hundreds of files I would change the scripts to stream page text to disk, process files line by line, add stronger progress/error logging, and use a more robust table/OCR pipeline where needed.

Another limitation is that `build_extraction_json.py` has a manual list for the PDFs that did not follow the cleaner EPD Hub layout. This means the script does not fully discover and parse every PDF automatically from the folder. I used the manual list because some PDFs needed hand-checked values from rendered pages, but this would not scale well. A better version would read all files from the folder, detect the EPD format, use a parser for known layouts, and send uncertain files into a review queue instead of hardcoding them in `MANUAL`.
