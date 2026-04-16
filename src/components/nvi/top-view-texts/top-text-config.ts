import { dataTestId } from '../../../utils/dataTestIds';
import { NviTopTextViewVariant } from './top-text-types';

export const variantConfig = {
  [NviTopTextViewVariant.Admin]: {
    alwaysVisibleTextKey: 'nvi_publication_points_description_admin',
    expandedTextKey: 'nvi_publication_points_description_admin_more',
    testId: dataTestId.basicData.nvi.publicationPointsExpandDescriptionButton,
  },
  [NviTopTextViewVariant.Curator]: {
    alwaysVisibleTextKey: 'nvi_publication_points_description',
    expandedTextKey: 'nvi_publication_points_description_more',
    testId: dataTestId.basicData.nvi.curatorPublicationPointsExpandDescriptionButton,
  },
} as const;
