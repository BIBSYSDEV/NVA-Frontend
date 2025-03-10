export const getSelectedFacetsArray = (searchParams: URLSearchParams, relevantParams: string[]) =>
  Array.from(searchParams).flatMap(([param, value]) =>
    value
      .split(',')
      .map((thisValue) => ({ param, value: thisValue }))
      .filter(({ param }) => relevantParams.includes(param))
  );
