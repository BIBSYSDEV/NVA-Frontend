import {
  ArchitectureType,
  DesignType,
  LiteraryArtsType,
  MovingPictureType,
  PerformingArtType,
  VisualArtType,
} from '../../../types/publication_types/artisticRegistration.types';
import { PagesRange } from '../../../types/publication_types/pages.types';

/**
 * Formats a page range as a string.
 * @param pages Object with `begin` and `end` page numbers (either may be missing).
 * @returns An empty string if both ends are missing, a single value if they are equal,
 *   or a `begin-end` interval (with `?` in place of missing ends).
 */
export const getPageInterval = (pages: PagesRange | null) => {
  if (!pages?.begin && !pages?.end) {
    return '';
  }
  return pages.begin === pages.end ? pages.begin : `${pages.begin ?? '?'}-${pages.end ?? '?'}`;
};

export const otherArtisticSubtypes = [
  DesignType.Other,
  ArchitectureType.Other,
  PerformingArtType.Other,
  MovingPictureType.Other,
  VisualArtType.Other,
  LiteraryArtsType.Other,
];
