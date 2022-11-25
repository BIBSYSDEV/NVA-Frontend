import { SeriesFields } from '../components/SeriesFields';
import { DegreeType } from '../../../../types/publicationFieldNames';
import { PublisherField } from '../components/PublisherField';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';

interface DegreeFormProps {
  subType: string;
}

export const DegreeForm = ({ subType }: DegreeFormProps) => (
  <>
    <PublisherField />
    <IsbnAndPages />

    {(subType === DegreeType.Phd || subType === DegreeType.Licentiate) && <SeriesFields />}
  </>
);
