# AI as Second Checker

AI is used as a second checker to compare each extracted JSON file against its respective EPD PDF.

The AI review is not treated as the source of truth. The source of truth is always the EPD PDF and the provenance attached to each extracted value.

## Review Rules

- Do not guess.
- Only mark a value as `declared` if it is explicitly present in the PDF.
- If the PDF clearly says `ND` or `not declared`, mark the value as `not_declared`.
- If the value cannot be found in the PDF, mark it as `not_extracted`.
- If the value appears to exist but is unclear, inconsistent, or difficult to verify, mark it as `needs_review`.
- Every `declared` value must include `source_page` and `source_table`.
- Missing values must never be treated as `0`.

## Status Definitions

### `declared`

The value is explicitly present in the PDF.

Use this status only when:

- the value is found in the PDF
- the unit is clear
- the lifecycle stage is clear
- the source page is clear
- the source table or section is clear

Example:

```json
{
  "value": 275,
  "status": "declared",
  "source_page": 13,
  "source_table": "Core environmental impact indicators"
}
```

### `not_declared`

The PDF explicitly states that the lifecycle stage is `ND` or `not declared`.

This means the stage is outside the declared scope of the EPD. It does not mean the value is zero.

Example:

```json
{
  "value": null,
  "status": "not_declared",
  "source_page": 5,
  "source_table": "System boundaries"
}
```

### `not_extracted`

The script or AI checker could not find the value, and there is no clear evidence that the PDF marks it as `ND` or `not declared`.

This means the value may exist in the PDF, but it was not captured during extraction.

Example:

```json
{
  "value": null,
  "status": "not_extracted",
  "source_page": null,
  "source_table": null,
  "note": "Value was not found during extraction."
}
```

### `needs_review`

There is some indication that the value exists, but it is not reliable enough to mark as `declared`.

Use this status when:

- the number is unclear
- the unit is unclear
- the lifecycle stage is ambiguous
- OCR or table extraction may be wrong
- the summary and detailed table appear inconsistent
- manual verification is needed

Example:

```json
{
  "value": 12.2,
  "status": "needs_review",
  "source_page": 14,
  "source_table": "Environmental impact data",
  "note": "Value was found but needs manual verification."
}
```

## Final Rule

Python extracts the first draft.

AI reviews the draft against the PDF.

Human review is required for `needs_review` and high-risk values.

The PDF and its provenance always win.
