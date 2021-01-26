import { Color } from '../themes/colors';

// from https://stackoverflow.com/a/33890907
export const isBackgroundColorDark = (backgroundColor: string) => {
  if (!backgroundColor || backgroundColor === Color.White) {
    return false;
  }
  return parseInt(backgroundColor.replace('#', ''), 16) > 0xffffff / 2 ? false : true;
};
