import { ExhibitionBasic, ExhibitionManifestation } from '../../types/publication_types/exhibitionContent.types';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { AnnouncementsFieldsWrapper } from './AnnoucementsFieldsWrapper';
import { ExhibitionBasicRow } from './ExhibitionBasicRow';

interface ExhibitionFieldsProps {
  manifestations: ExhibitionManifestation[];
}

export const ExhibitionAnnouncementsFields = ({ manifestations }: ExhibitionFieldsProps) => {
  return (
    <AnnouncementsFieldsWrapper>
      {manifestations.map((exhibitManifestation, index) => {
        return (
          <ErrorBoundary key={index}>
            <ExhibitionBasicRow exhibitManifestation={exhibitManifestation as ExhibitionBasic} />
          </ErrorBoundary>
        );
      })}
    </AnnouncementsFieldsWrapper>
  );
};
