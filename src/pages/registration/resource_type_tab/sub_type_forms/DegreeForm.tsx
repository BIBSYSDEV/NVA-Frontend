import { DoiField } from '../components/DoiField';
import { SeriesFields } from '../components/SeriesFields';
import { DegreeType } from '../../../../types/publicationFieldNames';
import { PublisherField } from '../components/PublisherField';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';

interface DegreeFormProps {
  subType: DegreeType;
}

export const DegreeForm = ({ subType }: DegreeFormProps) => (
  <>
    <DoiField />
    <PublisherField />
    <IsbnAndPages />

    {subType === DegreeType.Phd && <SeriesFields />}
  </>
);
