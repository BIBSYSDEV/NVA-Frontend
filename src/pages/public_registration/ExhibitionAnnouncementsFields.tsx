import { ExhibitionBasic, ExhibitionManifestation } from '../../types/publication_types/exhibitionContent.types';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { AnnouncementsFieldsHeadline } from './AnnoucementsFieldsHeadline';
import { ExhibitionRow } from './ExhibitionRow';

interface ExhibitionFieldsProps {
  manifestations: ExhibitionManifestation[];
}

export const ExhibitionAnnouncementsFields = ({ manifestations }: ExhibitionFieldsProps) => {
  return (
    <>
      <AnnouncementsFieldsHeadline />
      {manifestations.map((exhibitManifestation, index) => {
        return (
          <ErrorBoundary key={index}>
            <ExhibitionRow exhibitManifestation={exhibitManifestation as ExhibitionBasic} />
          </ErrorBoundary>
        );
      })}
    </>
  );
};
