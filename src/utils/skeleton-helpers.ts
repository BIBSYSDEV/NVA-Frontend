const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

export const randomWidthPercent = (min: number, max: number) => `${getRandom(min, max)}%`;
