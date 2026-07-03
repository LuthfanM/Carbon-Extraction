# Low Carbon Materials Hub

Low Carbon Materials Hub is a Next.js application for comparing carbon data from concrete product Environmental Product Declarations (EPDs). The app reads extracted and reviewed EPD data from JSON files in the `data` folder, then displays GWP-total comparisons by lifecycle stage, compressive strength, production location, and source PDF page.

The main goal is to help users compare lower-carbon concrete products with transparent and traceable data. Missing lifecycle data is shown as `Not declared` and is not treated as zero.

## Main Features

- Display concrete products from structured EPD data.
- Compare carbon impact by lifecycle stage, including `A1-A3`, `A4`, `A5`, `C1-C4`, and `D`.
- Filter products by strength and production location.
- Show data completeness status and comparison limitations.
- Provide source PDF references and page provenance for carbon values.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Local JSON data

## Installation

Make sure Node.js and npm are installed.

```bash
npm install
```

Run the app in development mode:

```bash
npm run dev
```

Open the app in your browser:

```txt
http://localhost:3000
```

## Scripts

```bash
npm run dev
```

Runs the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a build.

```bash
npm run typecheck
```

Checks TypeScript without emitting build output.

## Data Structure

Product data lives in the `data` folder as `.json` files. Source PDFs live in `public/epd`. The app does not upload PDFs or extract data at runtime; extraction happens before the data is used by the application.
