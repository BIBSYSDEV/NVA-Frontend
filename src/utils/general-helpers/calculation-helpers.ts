/** Returns the percentage of `numberA` relative to `numberB`, rounded to the nearest integer.
 *  Returns `undefined` if either argument is undefined or if `numberB` is 0. */
export const percentageOfAComparedToB = (numberA?: number, numberB?: number): number | undefined =>
  numberA !== undefined && numberB !== undefined && numberB > 0 ? Math.round((numberA / numberB) * 100) : undefined;
