export const parseNumericParam = <T extends number | null | undefined>(
  param: string | null | undefined,
  fallback: T
): number | T => {
  if (param == null) return fallback;
  const parsed = Number(param);
  return Number.isFinite(parsed) ? parsed : fallback;
};
