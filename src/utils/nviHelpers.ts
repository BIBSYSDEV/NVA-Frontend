const minNviYear = 2011;

export const getNviYearFilterValues = () => {
  const thisYear = new Date().getFullYear();
  const nviYearFilterValues = [];
  for (let year = thisYear + 1; year >= minNviYear; year--) {
    nviYearFilterValues.push(year);
  }
  return nviYearFilterValues;
};
