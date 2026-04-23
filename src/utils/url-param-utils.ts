export const parseNumericParam = (param: string | null | undefined, fallback: number | null): number | null => {
  if (param == null) return fallback;
  const parsed = Number(param);
  return Number.isFinite(parsed) ? parsed : fallback;
};
