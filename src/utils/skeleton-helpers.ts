const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

export const getRandomWidthPercent = (min: number, max: number): string => `${getRandom(min, max)}%`;
