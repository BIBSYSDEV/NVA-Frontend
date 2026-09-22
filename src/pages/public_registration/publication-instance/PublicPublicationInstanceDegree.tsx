import { DegreePublicationInstance } from '../../../types/publication_types/degreeRegistration.types';
import { PublicTotalPagesContent } from './components/PublicTotalPagesContent';

export const PublicPublicationInstanceDegree = ({
  publicationInstance,
}: {
  publicationInstance: DegreePublicationInstance;
}) => {
  const { pages } = publicationInstance;

  return <PublicTotalPagesContent pages={pages} />;
};
