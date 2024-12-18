import { DegreeType } from '../../../../../types/publicationFieldNames';
import { IsbnAndPages } from '../../components/isbn_and_pages/IsbnAndPages';
import { PublisherField } from '../../components/PublisherField';
import { RelatedResultsField } from '../../components/RelatedResultsField';
import { SeriesFields } from '../../components/SeriesFields';

interface PhdFormProps {
  subType: DegreeType.Phd | DegreeType.ArtisticPhd;
}

export const PhdForm = ({ subType }: PhdFormProps) => {
  return (
    <>
      <PublisherField />

      {subType === DegreeType.Phd && (
        <>
          <IsbnAndPages />
          <SeriesFields />
        </>
      )}

      <RelatedResultsField />
    </>
  );
};
