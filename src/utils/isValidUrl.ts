export const isValidUrl = (string: string) => {
  try {
    new URL(string);
  } catch {
    return false;
  }
  return true;
};
