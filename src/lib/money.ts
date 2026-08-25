/**
 * Money is stored as Decimal(10,2) in Postgres and handled as pence-accurate
 * numbers in the app. These helpers keep rounding in one place so a total is
 * never a floating-point artefact like 74.99999999999999.
 */

/** Rounds to two decimals, correcting binary floating-point drift. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function toPence(value: number): number {
  return Math.round(value * 100);
}

export function fromPence(pence: number): number {
  return round2(pence / 100);
}

/** Sums money values without accumulating drift. */
export function sumMoney(values: number[]): number {
  return fromPence(values.reduce((total, value) => total + toPence(value), 0));
}

export function multiplyMoney(value: number, quantity: number): number {
  return fromPence(toPence(value) * quantity);
}
