export const displayDate = (date: { year: string; month?: string; day?: string }) => {
  if (date.month && date.day) {
    return new Date(+date.year, +date.month - 1, +date.day).toLocaleDateString();
  } else {
    return date.year;
  }
};
