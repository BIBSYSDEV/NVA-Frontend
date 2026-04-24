export const percentageOfAComparedToB = (numberA?: number, numberB?: number): number | undefined =>
  numberA !== undefined && numberB !== undefined && numberB > 0 ? Math.round((numberA / numberB) * 100) : undefined;
