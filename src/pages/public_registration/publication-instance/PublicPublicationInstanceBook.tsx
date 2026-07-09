import { BookPublicationInstance } from '../../../types/publication_types/bookRegistration.types';
import { PublicTotalPagesContent } from './components/PublicTotalPagesContent';

export const PublicPublicationInstanceBook = ({
  publicationInstance,
}: {
  publicationInstance: BookPublicationInstance;
}) => {
  const { pages } = publicationInstance;

  return <PublicTotalPagesContent pages={pages} />;
};
