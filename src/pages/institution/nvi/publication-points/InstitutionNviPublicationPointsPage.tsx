import { NviPublicationPointsOverview } from '../../../../components/nvi-publication-points-overview/NviPublicationPointsOverview';
import { dataTestId } from '../../../../utils/dataTestIds';

export const InstitutionNviPublicationPointsPage = () => (
  <NviPublicationPointsOverview
    linkable={false}
    testId={dataTestId.editor.nviPublicationPointsExpandDescriptionButton}
  />
);
