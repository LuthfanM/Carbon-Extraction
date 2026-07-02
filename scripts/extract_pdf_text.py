from pathlib import Path
import re

import pdfplumber


PDF_DIR = Path("public/epd")
OUT_DIR = Path("tmp/extracted")


def clean(text: str) -> str:
    text = text.replace("\x00", "")
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for pdf_path in sorted(PDF_DIR.glob("*.pdf")):
        stem = pdf_path.stem
        out_path = OUT_DIR / f"{stem}.txt"
        lines: list[str] = []

        with pdfplumber.open(pdf_path) as pdf:
            lines.append(f"SOURCE: {pdf_path}")
            lines.append(f"PAGES: {len(pdf.pages)}")
            for index, page in enumerate(pdf.pages, start=1):
                text = clean(page.extract_text(layout=True) or "")
                lines.append("")
                lines.append(f"===== PAGE {index} =====")
                lines.append(text)

        out_path.write_text("\n".join(lines), encoding="utf-8")
        print(out_path)


if __name__ == "__main__":
    main()
