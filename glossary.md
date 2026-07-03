# Glossary

This file explains carbon and EPD terms in simple language.

## EPD

**EPD** means **Environmental Product Declaration**.

In simple words: an EPD is a formal document that explains the environmental impact of a product, including its carbon footprint.

For this project, the EPDs are for concrete products.

## GWP

**GWP** means **Global Warming Potential**.

In simple words: this is the carbon impact number. It tells us how much a product contributes to global warming.

In the JSON files, the main indicator is:

```txt
GWP-total
```

## GWP-total

**GWP-total** is the total global warming impact reported by the EPD for a lifecycle stage.

It is usually shown in:

```txt
kg CO2e
```

## kg CO2e

**kg CO2e** means **kilograms of carbon dioxide equivalent**.

In simple words: different greenhouse gases are converted into one common unit, so they can be compared like one carbon number.

Example:

```txt
275 kg CO2e
```

means the impact is equivalent to 275 kg of CO2.

## Declared Unit

The **declared unit** is the unit used for comparison.

For concrete, this is often:

```txt
1 m3
1 cubic metre
```

This matters because carbon numbers only make sense when the unit is the same. Comparing carbon per `1 m3` with carbon per `1 kg` would not be fair.

## Compressive Strength

**Compressive strength** means how strong the concrete is when pressed.

It is usually shown in:

```txt
MPa
```

Example:

```txt
25 MPa
32 MPa
40 MPa
```

A fair comparison should usually compare products with similar strength.

## MPa

**MPa** means **megapascal**.

In this project, it is the unit for concrete strength.

## Lifecycle Stage

A **lifecycle stage** is one part of the product's life.

Concrete has carbon impact from many stages: making materials, manufacturing, transport, construction, end of life, and possible recycling benefits.

The stages are named using codes like `A1`, `A2`, `A3`, `C1`, `D`.

## A1

**A1 = Raw material supply**

In simple words: getting the raw materials needed to make the concrete.

Example materials:

- cement
- sand
- aggregate
- water
- admixtures

## A2

**A2 = Transport to manufacturer**

In simple words: moving raw materials to the concrete plant or factory.

## A3

**A3 = Manufacturing**

In simple words: making or batching the concrete at the plant.

## A1-A3

**A1-A3 = Product stage**

This combines:

- `A1`: raw materials
- `A2`: transport to manufacturer
- `A3`: manufacturing

This is often the most commonly compared number because many EPDs report it.

## A4

**A4 = Transport to construction site**

In simple words: delivering the concrete from the plant to the project site.

If `A4` is not declared, it does not mean transport carbon is zero. It means the EPD did not provide the number.

## A5

**A5 = Construction or installation**

In simple words: carbon impact from using the product on the construction site.

For concrete, this can include placement, site activity, waste, or related construction processes depending on the EPD.

## B1

**B1 = Use**

In simple words: impact while the product is being used in the building or structure.

For concrete, many EPDs do not declare this stage.

## B2

**B2 = Maintenance**

In simple words: impact from maintaining the product during its life.

## B3

**B3 = Repair**

In simple words: impact from repairing the product.

## B4

**B4 = Replacement**

In simple words: impact if the product needs to be replaced.

## B5

**B5 = Refurbishment**

In simple words: impact from major improvement or refurbishment work.

## B6

**B6 = Operational energy use**

In simple words: energy used during the operation of the building or asset.

For concrete products, this is often not relevant or not declared.

## B7

**B7 = Operational water use**

In simple words: water used during the operation of the building or asset.

For concrete products, this is often not relevant or not declared.

## B1-B7

**B1-B7 = Use stage**

This is the group of all `B` stages.

If the app groups them, it should be careful:

- if all are missing, show `Not declared`
- if only some are declared, show `Partially declared`
- do not treat missing B stages as zero

## C1

**C1 = Demolition or deconstruction**

In simple words: impact from breaking down or removing the concrete at end of life.

## C2

**C2 = Transport after demolition**

In simple words: moving demolished concrete to landfill, recycling, or processing.

## C3

**C3 = Waste processing**

In simple words: processing the concrete waste, for example crushing it for recycling.

## C4

**C4 = Disposal**

In simple words: final disposal, such as landfill.

## D

**D = Benefits and loads beyond the system boundary**

In simple words: possible credit or impact after the product life cycle, often related to reuse, recycling, or recovered materials.

Important: `D` can be negative. A negative value is not always "better product carbon"; it usually means a recycling or recovery credit outside the main product lifecycle.

## Not Declared

**Not declared** means the EPD does not provide a value for that stage.

It does **not** mean zero.

Example:

```json
{
  "value": null,
  "status": "not_declared"
}
```

## Not Extracted

**Not extracted** means the value may exist somewhere in the PDF, but it was not captured confidently during extraction.

This should be checked before using the number for a decision.

## Provenance

**Provenance** means where the number came from.

For this project, every carbon number should link back to:

- source PDF
- source page
- source table or row

This is important because people should be able to check the original EPD before making procurement decisions.

## System Boundary

**System boundary** means which lifecycle stages are included in the EPD.

Example:

```txt
Cradle to gate
```

usually means the EPD includes early stages like `A1-A3`, but not necessarily transport, use, or end-of-life.

## Cradle to Gate

**Cradle to gate** usually means from raw materials up to the factory gate.

For concrete, this often means:

```txt
A1-A3
```

## Cradle to Grave

**Cradle to grave** means from raw materials all the way to end of life.

This may include:

```txt
A1-A3, A4, A5, B stages, C stages, and sometimes D
```

But always check the EPD, because not every document declares every stage.
