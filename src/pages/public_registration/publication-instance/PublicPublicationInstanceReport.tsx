import { ReportPublicationInstance } from '../../../types/publication_types/reportRegistration.types';
import { PublicTotalPagesContent } from './components/PublicTotalPagesContent';

export const PublicPublicationInstanceReport = ({
  publicationInstance,
}: {
  publicationInstance: ReportPublicationInstance;
}) => {
  const { pages } = publicationInstance;

  return <PublicTotalPagesContent pages={pages} />;
};
